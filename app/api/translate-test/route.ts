import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import marvelPrompt from "../../utils/marvel.json";
import { skillMap } from "../../utils/marvelGlossary";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_MODEL = "gpt-5-mini";

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // 쿼리 파라미터로 특정 패치 ID를 받거나, 가장 최근 번역된 패치 1개를 사용
    const { searchParams } = new URL(request.url);
    const patchId = searchParams.get("id");

    let query = supabase
      .from("steam_patch_logs")
      .select("id, content, translated_ko")
      .not("content", "is", null);

    if (patchId) {
      query = query.eq("id", patchId);
    } else {
      // 번역된 패치 중 가장 최근 것 1개 (비교 가능하도록)
      query = query.not("translated_ko", "is", null).order("published_at", { ascending: false }).limit(1);
    }

    const { data: patchLogs, error: fetchError } = await query;

    if (fetchError || !patchLogs || patchLogs.length === 0) {
      return NextResponse.json({
        status: "error",
        error: fetchError?.message || "No patch logs found",
        duration_ms: Date.now() - startTime,
      }, { status: 400 });
    }

    const log = patchLogs[0];

    // YouTube 태그 보존
    const youtubeTags: string[] = [];
    let contentToTranslate = log.content.replace(
      /\[previewyoutube="([^"]+)"\]\[\/previewyoutube\]/g,
      (match: string) => {
        const placeholder = `__YOUTUBE_PLACEHOLDER_${youtubeTags.length}__`;
        youtubeTags.push(match);
        return placeholder;
      }
    );

    // skillMap 프롬프트
    const skillMappings = Object.entries(skillMap)
      .map(([key, value]) => `        "${key}": "${value}"`)
      .join(",\n");

    const enhancedSystemPrompt = marvelPrompt.messages[0].content +
      `\n\nWhen translating skill names, use these exact mappings:\n{\n${skillMappings}\n}\n\nIMPORTANT: Keep all placeholders like __YOUTUBE_PLACEHOLDER_N__ exactly as they are without translating them.`;

    const requestBody = {
      ...marvelPrompt,
      model: TEST_MODEL,
      reasoning_effort: "minimal",
      messages: [
        {
          ...marvelPrompt.messages[0],
          content: enhancedSystemPrompt
        },
        {
          role: "user",
          content: contentToTranslate,
        },
      ],
    };

    // OpenAI API 호출
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
      return NextResponse.json({
        status: "error",
        patch_id: log.id,
        model: TEST_MODEL,
        http_status: openaiResponse.status,
        error: errorText,
        api_duration_ms: apiDuration,
        total_duration_ms: Date.now() - startTime,
      }, { status: 200 }); // 200으로 반환해서 에러 내용을 확인 가능하게
    }

    const openaiData = await openaiResponse.json();
    let translatedContent = openaiData.choices?.[0]?.message?.content;

    if (!translatedContent) {
      return NextResponse.json({
        status: "error",
        patch_id: log.id,
        model: TEST_MODEL,
        error: "No translation content in response",
        raw_response: openaiData,
        api_duration_ms: apiDuration,
        total_duration_ms: Date.now() - startTime,
      });
    }

    // 후처리
    translatedContent = translatedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    youtubeTags.forEach((tag, index) => {
      const placeholder = `__YOUTUBE_PLACEHOLDER_${index}__`;
      translatedContent = translatedContent.replace(placeholder, tag);
    });

    return NextResponse.json({
      status: "success",
      patch_id: log.id,
      model: openaiData.model || TEST_MODEL,
      usage: openaiData.usage || null,
      api_duration_ms: apiDuration,
      total_duration_ms: Date.now() - startTime,
      content_length: {
        original: log.content.length,
        translated: translatedContent.length,
      },
      translated_preview: translatedContent.substring(0, 500) + "...",
      // DB에 저장하지 않음 - 테스트 전용
      saved_to_db: false,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      total_duration_ms: Date.now() - startTime,
    }, { status: 500 });
  }
}
