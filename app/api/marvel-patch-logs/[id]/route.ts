import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await Promise.resolve(params);
  try {
    const { data, error } = await supabase
      .from("steam_patch_logs")
      .select(
        '*'
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching patch detail:", error);
    return NextResponse.json(
      { error: "패치 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
