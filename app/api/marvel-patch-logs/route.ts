import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SteamAppMetadata {
  capsule_image: string;
}

interface DatabaseRow {
  id: string;
  title: string;
  app_id: string;
  app_gid: string;
  app_name: string;
  published_at: string;
  steam_app_metadata: SteamAppMetadata;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("steam_patch_logs")
      .select(
        `
        id, title, app_id, app_gid, app_name, published_at,
        steam_app_metadata (
          capsule_image
        )
      `
      )
      .order("published_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    const formattedData = (data as unknown as DatabaseRow[]).map((item) => {
      console.log("[patched current log item]:", item);
      return {
        id: item.id,
        app_name: item.app_name,
        app_gid: item.app_gid,
        title: item.title,
        published_at: item.published_at,
        capsule_image: item.steam_app_metadata.capsule_image,
      };
    });
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching patch logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch patch logs" },
      { status: 500 }
    );
  }
}
