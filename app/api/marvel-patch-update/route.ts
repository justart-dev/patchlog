import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import gameAppIds from "../../utils/appid";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const appid = searchParams.get("appid") || gameAppIds.marvelRivals;
  const count = searchParams.get("count") || "5";

  try {
    // Steam API에서 데이터 가져오기
    const steamApiUrl = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=${count}&format=json`;
    console.log("Steam API URL:", steamApiUrl);
    const response = await fetch(steamApiUrl);

    if (!response.ok) {
      throw new Error(`Steam API request failed: ${response.status}`);
    }

    const data = await response.json();

    const processedItems = data.appnews.newsitems
      .filter((item: any) => item.feed_type === 1)
      .map((item: any) => {
        const formatContent = item.contents.replace(
          "{STEAM_CLAN_IMAGE}",
          "https://clan.cloudflare.steamstatic.com/images"
        );

        return {
          app_id: data.appnews.appid.toString(),
          app_name: item.author,
          app_gid: item.gid,
          title: item.title,
          content: formatContent,
          url: item.url,
          published_at: new Date(item.date * 1000).toISOString(),
          synced_at: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
        };
      });

    const { error } = await supabase
      .from("steam_patch_logs")
      .upsert(processedItems, {
        onConflict: "app_gid",
        ignoreDuplicates: true,
      });

    if (error) {
      console.error("Error inserting patch logs:", error);
      return NextResponse.json(
        { error: "Failed to insert patch logs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inserted: processedItems.length,
      appid: data.appnews.appid,
    });
  } catch (error) {
    console.error("Error in steam patch sync:", error);
    return NextResponse.json(
      { error: "Failed to sync steam patch logs" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
