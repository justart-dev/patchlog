import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import marvelPrompt from "../../utils/marvel.json";
import { getSkillMap } from "../../utils/skillMapService";
import {
  applyProtectedTermPlaceholders,
  extractUnmappedSkillLikeTerms,
} from "../../utils/translationProtection";
import { systemGlossary } from "../../utils/systemGlossary";
import { postProcessTranslation } from "../../utils/postProcessTranslation";
import { convertUtcDateTimesToKorean } from "../../utils/utcDateFormatter";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface PatchLog {
  id: string;
  content: string;
  translated_ko?: string;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const skillMap = await getSkillMap();

    // content가 있고 translated_ko가 null인 레코드들만 가져오기
    const { data: patchLogs, error: fetchError } = await supabase
      .from("steam_patch_logs")
      .select("id, content, translated_ko")
      .not("content", "is", null)
      .is("translated_ko", null)
      .order("published_at", { ascending: false })
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
        let contentToTranslate = convertUtcDateTimesToKorean(log.content).replace(
          /\[previewyoutube="([^"]+)"\]\[\/previewyoutube\]/g,
          (match) => {
            const placeholder = `__YOUTUBE_PLACEHOLDER_${youtubeTags.length}__`;
            youtubeTags.push(match);
            return placeholder;
          }
        );

        // 나무위키(skillMap)에 없는 스킬명/팀업명은 영문 그대로 유지하도록 보호
        const unmappedTerms = extractUnmappedSkillLikeTerms(contentToTranslate, skillMap);
        const systemTerms = Object.keys(systemGlossary);
        const termsToProtect = Array.from(
          new Set([...unmappedTerms, ...systemTerms])
        ).sort((a, b) => b.length - a.length);
        const { protectedContent, placeholders: protectedTerms } =
          applyProtectedTermPlaceholders(contentToTranslate, termsToProtect);
        contentToTranslate = protectedContent;

        // skillMap을 프롯트에 추가
        const skillMappings = Object.entries(skillMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");

        const enhancedSystemPrompt = marvelPrompt.messages[0].content +
          `\n\nWhen translating skill names, use these exact mappings:\n{\n${skillMappings}\n}\n\nIMPORTANT: Skill names that are NOT present in the mappings must remain in the original English exactly as written. Do not invent Korean names for unmapped skills or team-up abilities. Keep all placeholders like __YOUTUBE_PLACEHOLDER_N__ and __SKILL_TERM_PLACEHOLDER_N__ exactly as they are without translating them.`;

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

        // ```html ``` 태그 제거
        translatedContent = translatedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');

        // YouTube 플레이스홀더 복원
        youtubeTags.forEach((tag, index) => {
          const placeholder = `__YOUTUBE_PLACEHOLDER_${index}__`;
          translatedContent = translatedContent.replace(placeholder, tag);
        });

        // 후처리: 모든 치환을 하나의 함수로 통합
        translatedContent = postProcessTranslation({
          translatedContent,
          skillMap,
          protectedTerms,
        });

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
