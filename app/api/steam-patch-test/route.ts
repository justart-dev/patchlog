import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

import { dummyData } from "./dummy-data";

export async function POST() {
  // 테스트용 고정 데이터 (실제론 외부 API 호출 후 데이터 넣음)
  const data = dummyData;

  const news = data.appnews.newsitems[0];

  const { error } = await supabase.from("steam_patch_logs").insert({
    app_id: data.appnews.appid.toString(),
    app_gid: news.gid,
    app_name: news.author,
    title: news.title,
    content: news.contents,
    published_at: new Date(news.date * 1000).toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Insert success" });
}
