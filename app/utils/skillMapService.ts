import "server-only";

import { createClient } from "@supabase/supabase-js";
import { revalidateTag, unstable_cache } from "next/cache";
import { ParsedSkill } from "./skillParser";

const TABLE_NAME = "marvel_skill_map";
const SKILL_MAP_TAG = "skill-map";

interface SkillMapRow {
  english_name: string;
  korean_name: string;
  key_label: string | null;
  is_active: boolean | null;
}

function getSupabaseServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceKey);
}

function buildValue(koreanName: string, keyLabel?: string | null): string {
  if (!keyLabel) return koreanName;
  return `${koreanName}(${keyLabel})`;
}

function toSkillMap(rows: SkillMapRow[]): Record<string, string> {
  const map: Record<string, string> = {};

  rows.forEach((row) => {
    if (!row.english_name || !row.korean_name) return;
    if (row.is_active === false) return;
    map[row.english_name] = buildValue(row.korean_name, row.key_label);
  });

  return map;
}

async function fetchSkillMapFromDb(throwOnError = false): Promise<Record<string, string>> {
  const client = getSupabaseServiceClient();
  if (!client) {
    const err = new Error("[skill-map] DB client unavailable");
    if (throwOnError) throw err;
    console.warn(err.message);
    return {};
  }

  const { data, error } = await client
    .from(TABLE_NAME)
    .select("english_name, korean_name, key_label, is_active")
    .eq("is_active", true);

  if (error) {
    if (throwOnError) {
      throw new Error(`[skill-map] failed to fetch dynamic map: ${error.message}`);
    }
    console.warn(`[skill-map] failed to fetch dynamic map: ${error.message}`);
    return {};
  }

  return toSkillMap((data || []) as SkillMapRow[]);
}

const getCachedSkillMap = unstable_cache(
  async () => fetchSkillMapFromDb(true),
  ["marvel-skill-map-v1"],
  { tags: [SKILL_MAP_TAG] }
);

export function clearSkillMapCache() {
  revalidateTag(SKILL_MAP_TAG, "max");
}

export async function getSkillMap(): Promise<Record<string, string>> {
  try {
    return await getCachedSkillMap();
  } catch (error) {
    console.warn("[skill-map] cached fetch failed, trying direct fetch:", error);
    return fetchSkillMapFromDb(false);
  }
}

export async function upsertSkillMap(skills: ParsedSkill[], source: string) {
  const client = getSupabaseServiceClient();
  if (!client) {
    return {
      ok: false,
      error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing",
      upsertedCount: 0,
    };
  }

  if (skills.length === 0) {
    return {
      ok: true,
      error: null as string | null,
      upsertedCount: 0,
    };
  }

  const rows = skills.map((skill) => ({
    english_name: skill.englishName,
    korean_name: skill.koreanName,
    key_label: skill.key || (skill.type === "패시브" ? "패시브" : skill.type),
    type: skill.type,
    source,
    is_active: true,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await client.from(TABLE_NAME).upsert(rows, {
    onConflict: "english_name",
  });

  if (error) {
    return {
      ok: false,
      error: error.message,
      upsertedCount: 0,
    };
  }

  clearSkillMapCache();

  return {
    ok: true,
    error: null as string | null,
    upsertedCount: rows.length,
  };
}
