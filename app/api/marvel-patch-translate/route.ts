import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import marvelPrompt from "../../utils/marvel.json";
import { getSkillMap } from "../../utils/skillMapService";
import { heroMap } from "../../utils/heroMap";
import { systemGlossary } from "../../utils/systemGlossary";
import {
  applyProtectedTermPlaceholders,
  extractUnmappedSkillLikeTerms,
  restoreProtectedTermPlaceholders,
} from "../../utils/translationProtection";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface PatchLog {
  id: string;
  content: string;
  translated_ko?: string;
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    const skillMap = await getSkillMap();

    // 최근 7일 이내 & translated_ko가 null인 레코드들만 가져오기  
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: patchLogs, error: fetchError } = await supabase
      .from("steam_patch_logs")
      .select("id, content, translated_ko")
      .gte("synced_at", sevenDaysAgo)
      .is("translated_ko", null)
      .limit(20);

    if (fetchError) {
      console.error("Error fetching patch logs:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch patch logs" },
        { status: 500 }
      );
    }

    if (!patchLogs || patchLogs.length === 0) {
      return NextResponse.json({ message: "No patch logs to translate" });
    }

    let translatedCount = 0;
    const results: Array<{
      id: string;
      status: string;
      model?: string;
      tokens?: number;
      duration_ms?: number;
      error?: string;
    }> = [];

    // 각 패치 로그를 번역
    for (const log of patchLogs as PatchLog[]) {
      try {
        // content가 null이거나 빈 문자열인 경우 건너뛰기
        if (!log.content || log.content.trim() === '') {
          results.push({ id: log.id, status: "skipped", error: "empty content" });
          continue;
        }

        // YouTube 태그를 플레이스홀더로 치환하여 보존
        const youtubeTags: string[] = [];
        let contentToTranslate = log.content.replace(
          /\[previewyoutube="([^"]+)"\]\[\/previewyoutube\]/g,
          (match) => {
            const placeholder = `__YOUTUBE_PLACEHOLDER_${youtubeTags.length}__`;
            youtubeTags.push(match);
            return placeholder;
          }
        );

        // 나무위키(skillMap)에 없는 스킬명/팀업명은 영문 그대로 유지하도록 보호
        const unmappedTerms = extractUnmappedSkillLikeTerms(contentToTranslate, skillMap);
        const { protectedContent, placeholders: protectedTerms } =
          applyProtectedTermPlaceholders(contentToTranslate, unmappedTerms);
        contentToTranslate = protectedContent;

        // skillMap을 프롬프트에 추가
        const skillMappings = Object.entries(skillMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");
        const heroMappings = Object.entries(heroMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");
        const systemMappings = Object.entries(systemGlossary)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");

        const enhancedSystemPrompt = marvelPrompt.messages[0].content +
          `\n\nWhen translating skill names, use these exact mappings:\n{\n${skillMappings}\n}\n\nWhen translating hero names, use these exact mappings:\n{\n${heroMappings}\n}\n\nWhen translating system and UI terms, use these exact mappings:\n{\n${systemMappings}\n}\n\nIMPORTANT: Skill names that are NOT present in the mappings must remain in the original English exactly as written. Do not invent Korean names for unmapped skills or team-up abilities. Keep all placeholders like __YOUTUBE_PLACEHOLDER_N__ and __SKILL_TERM_PLACEHOLDER_N__ exactly as they are without translating them.`;

        // OpenAI API 호출하여 번역
        const requestBody = {
          ...marvelPrompt,
          reasoning_effort: "minimal",
          messages: [
            {
              ...marvelPrompt.messages[0],
              content: enhancedSystemPrompt
            }, // enhanced system message
            {
              role: "user",
              content: contentToTranslate,
            },
          ],
        };

        const apiStartTime = Date.now();
        const openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
        const apiDuration = Date.now() - apiStartTime;

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error(
            `OpenAI API error for log ${log.id}:`,
            openaiResponse.status,
            errorText
          );
          results.push({ id: log.id, status: "error", model: marvelPrompt.model, duration_ms: apiDuration, error: `HTTP ${openaiResponse.status}: ${errorText.substring(0, 200)}` });
          continue;
        }

        const openaiData = await openaiResponse.json();
        let translatedContent = openaiData.choices?.[0]?.message?.content;

        if (!translatedContent) {
          console.error(`No translation received for log ${log.id}`);
          results.push({ id: log.id, status: "error", model: openaiData.model, duration_ms: apiDuration, error: "No translation content in response" });
          continue;
        }

        // ```html ``` 태그 제거 (ChatGPT가 코드블록으로 감쌀 경우)
        translatedContent = translatedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');

        // YouTube 플레이스홀더를 원래 태그로 복원
        youtubeTags.forEach((tag, index) => {
          const placeholder = `__YOUTUBE_PLACEHOLDER_${index}__`;
          translatedContent = translatedContent.replace(placeholder, tag);
        });

        // 후처리: 남아 있는 명시적 영문 용어를 치환하고, 키 매핑은 유지하되 중복 생성은 최소화
        const sortedSkillEntries = Object.entries(skillMap).sort(
          ([a], [b]) => b.length - a.length
        );
        sortedSkillEntries.forEach(([englishName, koreanName]) => {
          const englishPattern = new RegExp(escapeRegex(englishName), "g");
          translatedContent = translatedContent.replace(englishPattern, koreanName);

          // 모델이 한글 스킬명만 남기고 키 정보를 빠뜨린 경우에만 전체 매핑을 보강
          const koreanMatch = koreanName.match(/^(.+?)\((.+)\)$/);
          if (koreanMatch) {
            const [, nameOnly] = koreanMatch;
            const nameOnlyPattern = new RegExp(
              `${escapeRegex(nameOnly)}(?!\([^)]*\))`,
              "g"
            );
            translatedContent = translatedContent.replace(nameOnlyPattern, koreanName);
          }
        });

        // 중복 키 표기 보정: (우클릭)(우클릭), (Shift)(Shift) 같은 결과를 하나로 정리
        translatedContent = translatedContent.replace(
          /(\((?:좌클릭|우클릭|패시브|궁극기|Shift|E|Q|C|F|X|Ctrl|Space)\))(?:\1)+/g,
          "$1"
        );

        // 캐릭터명은 정확한 전체 이름만 치환하고, 부분 일치/추가 괄호 보정은 하지 않음
        const sortedHeroEntries = Object.entries(heroMap).sort(
          ([a], [b]) => b.length - a.length
        );
        sortedHeroEntries.forEach(([englishName, koreanName]) => {
          const heroPattern = new RegExp(`\\b${escapeRegex(englishName)}\\b`, "g");
          translatedContent = translatedContent.replace(heroPattern, koreanName);
        });

        // 시스템 용어는 UI/섹션성 문구만 최소한으로 치환
        Object.entries(systemGlossary).forEach(([englishName, koreanName]) => {
          const systemPattern = new RegExp(`\\b${escapeRegex(englishName)}\\b`, "g");
          translatedContent = translatedContent.replace(systemPattern, koreanName);
        });

        // LLM이 남긴 혼합형/한국어 잔여 표현 정규화
        translatedContent = translatedContent
          .replace(/체인-CC\s*보호/g, "연속 CC 보호")
          .replace(/체인 CC\s*보호/g, "연속 CC 보호")
          .replace(/체인-CC\s*\(군중 제어\)\s*보호/g, "연속 CC 보호")
          .replace(/체인 CC\s*\(군중 제어\)\s*보호/g, "연속 CC 보호")
          .replace(/체인-CC/g, "연속 CC")
          .replace(/체인 CC/g, "연속 CC");

        // 강인함 뒤 조사 보정 (예: 강인함를 -> 강인함을, <strong>강인함</strong>를 -> <strong>강인함</strong>을)
        const correctedTenacityParticles: Record<string, string> = {
          를: "을",
          는: "은",
          가: "이",
          와: "과",
          로: "으로",
          랑: "이랑",
        };
        translatedContent = translatedContent.replace(
          /(강인함(?:<\/[^>]+>)*)(를|는|가|와|로|랑)/g,
          (_, termWithTags, particle) => `${termWithTags}${correctedTenacityParticles[particle] ?? particle}`
        );

        // skillMap에 없는 스킬/팀업명은 모든 후처리 이후 영문 그대로 최종 복원
        translatedContent = restoreProtectedTermPlaceholders(
          translatedContent,
          protectedTerms
        );

        // DB에 번역 결과 업데이트
        const { error: updateError } = await supabase
          .from("steam_patch_logs")
          .update({ translated_ko: translatedContent })
          .eq("id", log.id);

        if (updateError) {
          console.error(`Error updating log ${log.id}:`, updateError);
          results.push({ id: log.id, status: "error", model: openaiData.model, duration_ms: apiDuration, error: `DB update failed: ${updateError.message}` });
          continue;
        }

        revalidatePath(`/patch/${log.id}`);
        revalidatePath("/patch");
        revalidateTag(`patch:${log.id}`, "max");
        revalidateTag("patch-list", "max");

        translatedCount++;
        results.push({ id: log.id, status: "success", model: openaiData.model, tokens: openaiData.usage?.total_tokens, duration_ms: apiDuration });

        // API 호출 간 잠시 대기 (rate limit 방지)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing log ${log.id}:`, error);
        results.push({ id: log.id, status: "error", error: error instanceof Error ? error.message : "Unknown error" });
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      totalLogs: patchLogs.length,
      translatedCount,
      message: `${translatedCount}/${patchLogs.length} patch logs translated successfully`,
      results,
    });
  } catch (error) {
    console.error("Error in translation process:", error);
    return NextResponse.json(
      { error: "Failed to translate patch logs" },
      { status: 500 }
    );
  }
}
