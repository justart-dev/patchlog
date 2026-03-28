import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import marvelPrompt from "../../utils/marvel.json";
import { getSkillMap } from "../../utils/skillMapService";
import { heroMap } from "../../utils/heroMap";

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

        // skillMap을 프롬프트에 추가
        const skillMappings = Object.entries(skillMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");
        const heroMappings = Object.entries(heroMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");

        const enhancedSystemPrompt = marvelPrompt.messages[0].content +
          `\n\nWhen translating skill names, use these exact mappings:\n{\n${skillMappings}\n}\n\nWhen translating hero names, use these exact mappings:\n{\n${heroMappings}\n}\n\nIMPORTANT: Keep all placeholders like __YOUTUBE_PLACEHOLDER_N__ exactly as they are without translating them.`;

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

        // 후처리: 잘못 번역된 스킬명들을 올바르게 교체
        Object.entries(skillMap).forEach(([englishName, koreanName]) => {
          // 영어명이 그대로 남아있는 경우 한글로 교체
          const englishPattern = new RegExp(englishName, 'g');
          translatedContent = translatedContent.replace(englishPattern, koreanName);
          
          // 키 정보가 빠진 한글명을 전체 형태로 교체 (이미 키 정보가 있으면 건너뛰기)
          const koreanMatch = koreanName.match(/^(.+?)\((.+)\)$/);
          if (koreanMatch) {
            const [, nameOnly, keyInfo] = koreanMatch;
            // 이미 키 정보가 있는지 확인하여 중복 방지
            const nameOnlyPattern = new RegExp(`${nameOnly}(?!\\([^)]*\\))`, 'g');
            translatedContent = translatedContent.replace(nameOnlyPattern, koreanName);
          }
        });

        // 후처리: 캐릭터명이 영어로 남아있으면 한글명으로 강제 치환
        Object.entries(heroMap).forEach(([englishName, koreanName]) => {
          // 단어 경계를 기준으로 치환해 일반 문장 부작용을 줄임
          const heroPattern = new RegExp(`\\b${escapeRegex(englishName)}\\b`, "gi");
          translatedContent = translatedContent.replace(heroPattern, koreanName);
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
