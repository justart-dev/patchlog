import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import marvelPrompt from "../../utils/marvel.json";
import { getSkillMap } from "../../utils/skillMapService";
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

/**
 * 번역 결과에서 영문 잔류 단어를 검출한다.
 * HTML 태그, URL, 플레이스홀더, 허용 약어를 제외한 3글자 이상 영단어 목록을 반환.
 */
function detectRemainingEnglish(text: string): string[] {
  const plainText = text
    .replace(/<[^>]+>/g, " ")        // HTML 태그 제거
    .replace(/https?:\/\/[^\s<>"']+/g, " ") // URL 제거
    .replace(/__\w+_PLACEHOLDER_\d+__/g, " ") // 플레이스홀더 제거
    .replace(/\[[^\]]+\]/g, " ");      // BBCode 잔여 제거

  // 허용 약어 (대문자 2~4글자 또는 알려진 게임 약어)
  const allowedAcronyms = new Set([
    "PvE", "PvP", "MVP", "PC", "PSN", "Xbox", "NSW",
    "UI", "UX", "API", "DPS", "AOE", "CC", "HUD",
    "FPS", "GG", "AFK", "DC", "XP", "HP",
    "KST", "UTC", "ET", "PT",
  ]);

  const words = plainText.match(/[A-Za-z]{3,}/g) || [];
  const filtered = words.filter((w) => {
    // 모두 대문자 2~4글자면 약어로 간주하여 제외
    if ( /^[A-Z]{2,4}$/.test(w) && allowedAcronyms.has(w)) return false;
    // 약어 목록에 있으면 제외
    if (allowedAcronyms.has(w)) return false;
    return true;
  });
  return Array.from(new Set(filtered));
}

/** 영문 잔류 재시도 임계값 */
const ENGLISH_RETRY_THRESHOLD = 5;
const MAX_RETRIES = 1;

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
      english_remaining?: number;
      retried?: boolean;
      error?: string;
    }> = [];

    for (const log of patchLogs as PatchLog[]) {
      try {
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

        // 이미지 태그를 플레이스홀더로 치환하여 보존 (YouTube와 동일 방식)
        const imageTags: string[] = [];
        contentToTranslate = contentToTranslate.replace(
          /\[img\s+src=["']([^"']+)["']\s*\]|\[img\]([\s\S]*?)\[\/img\]|<img\b[^>]*>/gi,
          (match) => {
            const placeholder = `__IMAGE_PLACEHOLDER_${imageTags.length}__`;
            imageTags.push(match);
            return placeholder;
          }
        );

        // skillMap을 프롬프트에 추가
        const skillMappings = Object.entries(skillMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");

        // NOTE: unmapped 스킬/코스튬/이벤트명은 LLM이 자연스러운 한국어 음역을 하도록 둔다.
        //       과거에는 플레이스홀더로 보호→영문 복원했으나, 이가 영문 잔류의 핵심 원인이었음.
        //       systemGlossary의 키도 보호하지 않는다 — postProcess에서 치환하기 때문.
        const enhancedSystemPrompt = marvelPrompt.messages[0].content +
          `\n\nWhen translating skill names, use these exact mappings:\n{\n${skillMappings}\n}\n\n` +
          `IMPORTANT: Skill names that ARE present in the mappings above must use the mapping exactly. ` +
          `Skill names, team-up ability names, costume/skin names, event names, and any other proper nouns NOT present in the mappings ` +
          `should be translated as natural Korean transliterations (e.g. Soulless Sword -> 소울리스 소드). ` +
          `Do NOT leave unmapped proper nouns in English — always Koreanize them. ` +
          `Keep all placeholders like __YOUTUBE_PLACEHOLDER_N__ exactly as they are without translating them.`;

        const buildRequestBody = (content: string, extraInstruction?: string) => {
          const systemContent = extraInstruction
            ? enhancedSystemPrompt + "\n\n" + extraInstruction
            : enhancedSystemPrompt;
          return {
            ...marvelPrompt,
            reasoning_effort: "low",
            messages: [
              {
                role: "system",
                content: systemContent,
              },
              {
                role: "user",
                content: content,
              },
            ],
          };
        };

        // ─── 1차 번역 ───
        const apiStartTime = Date.now();
        const requestBody = buildRequestBody(contentToTranslate);

        let openaiResponse = await fetch(
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
        let apiDuration = Date.now() - apiStartTime;

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

        let openaiData = await openaiResponse.json();
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

        // 이미지 플레이스홀더 복원 (YouTube 복원 직후, 후처리 전)
        imageTags.forEach((tag, index) => {
          const placeholder = `__IMAGE_PLACEHOLDER_${index}__`;
          translatedContent = translatedContent.replace(placeholder, tag);
        });

        // 후처리: skillMap, heroMap, systemGlossary 치환 (protectedTerms는 빈 배열 — 영문 복원 안 함)
        translatedContent = postProcessTranslation({
          translatedContent,
          skillMap,
          protectedTerms: [],
        });

        // ─── 영문 잔류 검증 + 재시도 ───
        let remainingEnglish = detectRemainingEnglish(translatedContent);
        let retried = false;

        if (remainingEnglish.length >= ENGLISH_RETRY_THRESHOLD && MAX_RETRIES > 0) {
          console.warn(`Retranslating ${log.id}: ${remainingEnglish.length} English words remain`);

          const retryInstruction =
            `CRITICAL: The previous translation contained ${remainingEnglish.length} untranslated English words. ` +
            `You MUST translate ALL of the following English words into natural Korean transliterations:\n` +
            remainingEnglish.map((w) => `  - "${w}"`).join("\n") + "\n" +
            `Do NOT leave any of these in English. Translate the entire content again ensuring zero English remains ` +
            `(except acronyms like PvE, PvP, MVP, PC and URLs/placeholders).`;

          const retryBody = buildRequestBody(contentToTranslate, retryInstruction);
          const retryStartTime = Date.now();
          openaiResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiApiKey}`,
              },
              body: JSON.stringify(retryBody),
            }
          );
          apiDuration += Date.now() - retryStartTime;

          if (openaiResponse.ok) {
            const retryData = await openaiResponse.json();
            let retryContent = retryData.choices?.[0]?.message?.content;
            if (retryContent) {
              retryContent = retryContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
              youtubeTags.forEach((tag, index) => {
                const placeholder = `__YOUTUBE_PLACEHOLDER_${index}__`;
                retryContent = retryContent.replace(placeholder, tag);
              });
              retryContent = postProcessTranslation({
                translatedContent: retryContent,
                skillMap,
                protectedTerms: [],
              });
              const retryRemaining = detectRemainingEnglish(retryContent);
              // 재시도 결과가 더 나으면 교체
              if (retryRemaining.length < remainingEnglish.length) {
                translatedContent = retryContent;
                remainingEnglish = retryRemaining;
              }
              retried = true;
            }
          }
        }

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
        results.push({
          id: log.id,
          status: "success",
          model: openaiData.model,
          tokens: openaiData.usage?.total_tokens,
          duration_ms: apiDuration,
          english_remaining: remainingEnglish.length,
          retried,
        });

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
