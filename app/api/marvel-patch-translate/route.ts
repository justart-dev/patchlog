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

export async function POST() {
  try {
    // 오늘 synced_at인 레코드들 가져오기 (한국시간 기준)
    const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000); // UTC+9
    const today = kstDate.toISOString().split("T")[0]; // YYYY-MM-DD 형태

    console.log(
      "Query range:",
      `${today}T00:00:00.000Z`,
      "to",
      `${today}T23:59:59.999Z`
    );

    const { data: patchLogs, error: fetchError } = await supabase
      .from("steam_patch_logs")
      .select("id, content, translated_ko, synced_at")
      .gte("synced_at", `${today}T00:00:00.000Z`)
      .lt("synced_at", `${today}T23:59:59.999Z`);

    console.log("Filtered results:", patchLogs);

    if (fetchError) {
      console.error("Error fetching patch logs:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch patch logs" },
        { status: 500 }
      );
    }

    if (!patchLogs || patchLogs.length === 0) {
      return NextResponse.json({ message: "No patch logs to translate today" });
    }

    let translatedCount = 0;

    // 각 패치 로그를 번역
    for (const log of patchLogs as PatchLog[]) {
      try {
        // OpenAI API 호출을 위한 body 준비
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

        // OpenAI API 호출
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
