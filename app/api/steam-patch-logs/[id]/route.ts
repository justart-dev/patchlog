import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  try {
    const { data, error } = await supabase
      .from("steam_patch_logs")
      .select(
        "id, title, published_at, content, app_name, app_gid,translated_ko"
      )
      .eq("id", resolvedParams.id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "패치 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      content: data.content,
      publishedAt: data.published_at,
      appName: data.app_name,
      appGid: data.app_gid,
      translateKo: data.translated_ko,
    });
  } catch (error) {
    console.error("Error fetching patch detail:", error);
    return NextResponse.json(
      { error: "패치 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
