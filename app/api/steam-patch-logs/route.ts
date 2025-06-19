import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
  .from("steam_patch_logs")
  .select(`
    id,title,app_id,app_gid,app_name,published_at,feed_type,
    steam_app_metadata (
      capsule_image
    )
  `)
  .eq("feed_type", 1)
  .order("published_at", { ascending: false })
  .limit(5);


    if (error) {
      throw error;
    }
    console.log('get logs data', data)
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching patch logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch patch logs" },
      { status: 500 }
    );
  }
}
