import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";

import { dummyData } from "./dummy-data";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


export async function POST() {
  // 테스트용 고정 데이터 (실제론 외부 API 호출 후 데이터 넣음)
  const data = dummyData;

  // 1. feed_type이 1인 항목만 필터링하고 bbobHTML로 파싱
  const processedItems = data.appnews.newsitems
    .filter(item => item.feed_type === 1)
    .map(item => {
      const parsedContent = bbobHTML(item.contents, presetHTML5());
      const formatContent = parsedContent.replace('{STEAM_CLAN_IMAGE}', 'https://clan.cloudflare.steamstatic.com/images');

      return {
        app_id: data.appnews.appid.toString(),
        app_name: item.author,
        app_gid: item.gid,
        title: item.title,
        content: formatContent,
        published_at: new Date(item.date * 1000).toISOString(),
        synced_at: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString()
      };
    });

  // 2. Supabase에 insert - 중복 방지를 위해 upsert 사용
  const { error } = await supabase
  .from('steam_patch_logs')                    
  .upsert(processedItems, {                     
    onConflict: 'app_gid',                    
    ignoreDuplicates: true                    
  });

  if (error) {
    console.error('Error inserting patch logs:', error);
    return NextResponse.json({ error: 'Failed to insert patch logs' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
