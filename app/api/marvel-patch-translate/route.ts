import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import marvelPrompt from "../../utils/marvel.json";
import { skillMap } from "../../utils/marvelGlossary";

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
  try {
    // 최근 7일 이내 & translated_ko가 null인 레코드들만 가져오기  
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    console.log("Fetching patch logs from last 7 days with null translated_ko...");
    console.log("Date range: from", sevenDaysAgo, "to now");

    const { data: patchLogs, error: fetchError } = await supabase
      .from("steam_patch_logs")
      .select("id, content, translated_ko")
      .gte("synced_at", sevenDaysAgo)
      .is("translated_ko", null)
      .limit(20);

    console.log("Found patch logs to translate:", patchLogs?.length || 0);

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

    // 각 패치 로그를 번역
    for (const log of patchLogs as PatchLog[]) {
      try {
        // content가 null이거나 빈 문자열인 경우 건너뛰기
        if (!log.content || log.content.trim() === '') {
          console.log(`Skipping log ${log.id}: empty content`);
          continue;
        }
        // skillMap을 프롬프트에 추가
        const skillMappings = Object.entries(skillMap)
          .map(([key, value]) => `        "${key}": "${value}"`)
          .join(",\n");
        
        const enhancedSystemPrompt = marvelPrompt.messages[0].content + 
          `\n\nWhen translating skill names, use these exact mappings:\n{\n${skillMappings}\n}`;

        // OpenAI API 호출하여 번역
        const requestBody = {
          ...marvelPrompt,
          messages: [
            {
              ...marvelPrompt.messages[0],
              content: enhancedSystemPrompt
            }, // enhanced system message
            {
              role: "user",
              content: log.content,
            },
          ],
        };

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

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error(
            `OpenAI API error for log ${log.id}:`,
            openaiResponse.status,
            errorText
          );
          continue;
        }

        const openaiData = await openaiResponse.json();
        let translatedContent = openaiData.choices?.[0]?.message?.content;

        if (!translatedContent) {
          console.error(`No translation received for log ${log.id}`);
          continue;
        }

        // ```html ``` 태그 제거
        translatedContent = translatedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        
        // 따옴표 제거
        translatedContent = translatedContent.replace(/'([^']+)'/g, '$1');
        
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

        // DB에 번역 결과 업데이트
        const { error: updateError } = await supabase
          .from("steam_patch_logs")
          .update({ translated_ko: translatedContent })
          .eq("id", log.id);

        if (updateError) {
          console.error(`Error updating log ${log.id}:`, updateError);
          continue;
        }

        translatedCount++;
        console.log(`Successfully translated log ${log.id}`);

        // API 호출 간 잠시 대기 (rate limit 방지)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing log ${log.id}:`, error);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      totalLogs: patchLogs.length,
      translatedCount,
      message: `${translatedCount}/${patchLogs.length} patch logs translated successfully`,
    });
  } catch (error) {
    console.error("Error in translation process:", error);
    return NextResponse.json(
      { error: "Failed to translate patch logs" },
      { status: 500 }
    );
  }
}
