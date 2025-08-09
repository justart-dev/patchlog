import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import marvelPrompt from "../../utils/marvel.json";

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
    // 최근 2일 이내 & translated_ko가 null인 레코드들만 가져오기
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    console.log("Fetching patch logs from last 2 days with null translated_ko...");
    console.log("Date range: from", twoDaysAgo, "to now");

    const { data: patchLogs, error: fetchError } = await supabase
      .from("steam_patch_logs")
      .select("id, content, translated_ko")
      .is("translated_ko", null)
      .gte("synced_at", twoDaysAgo)
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
        // OpenAI API 호출하여 번역
        const requestBody = {
          ...marvelPrompt,
          messages: [
            marvelPrompt.messages[0], // system message
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
          console.error(
            `OpenAI API error for log ${log.id}:`,
            openaiResponse.status
          );
          continue;
        }

        const openaiData = await openaiResponse.json();
        const translatedContent = openaiData.choices?.[0]?.message?.content;

        if (!translatedContent) {
          console.error(`No translation received for log ${log.id}`);
          continue;
        }

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
