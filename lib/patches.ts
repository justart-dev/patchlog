import { supabase } from "./supabase";
import { unstable_cache } from "next/cache";

export const getPatch = unstable_cache(
  async (id: string) => {
    const { data, error } = await supabase
      .from("steam_patch_logs")
      .select(
        `
      id, title, app_id, app_gid, app_name, published_at, url, content, translated_ko,
      steam_app_metadata (
        capsule_image
      )
    `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },
  ["patch-detail"],
  { revalidate: 3600 }
);

export const getPatches = unstable_cache(
  async (limit = 10) => {
    const { data, error } = await supabase
      .from("steam_patch_logs")
      .select(
        `
        id, title, app_id, app_gid, app_name, published_at, content, translated_ko,
        steam_app_metadata (
          capsule_image
        )
      `
      )
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`failed to load patch list: ${error.message}`);
    }

    return data.map((item: any) => ({
      ...item,
      capsule_image: item.steam_app_metadata?.capsule_image
    }));
  },
  ["patch-list"],
  { revalidate: 1800 }
);

export const getPatchSitemapEntries = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("steam_patch_logs")
      .select("id, published_at, updated_at")
      .order("published_at", { ascending: false });

    if (error) return [];
    return data;
  },
  ["patch-sitemap"],
  { revalidate: 3600 }
);

export async function getPatchNavigation(currentId: string, publishedAt: string) {
  const [newer, older] = await Promise.all([
    // Newer patch (published_at is greater/more recent)
    supabase
      .from("steam_patch_logs")
      .select("id, title")
      .gt("published_at", publishedAt)
      .order("published_at", { ascending: true })
      .limit(1)
      .single(),
    // Older patch (published_at is less/more past)
    supabase
      .from("steam_patch_logs")
      .select("id, title")
      .lt("published_at", publishedAt)
      .order("published_at", { ascending: false })
      .limit(1)
      .single()
  ]);

  return {
    newer: newer.data, // More recent patch
    older: older.data  // Older patch
  };
}

export const getAllPatchIds = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from("steam_patch_logs")
            .select("id");
            
        if (error) return [];
        return data;
    },
    ["all-patch-ids"],
    { revalidate: 3600 }
);
