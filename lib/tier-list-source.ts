import "server-only";

import { unstable_cache } from "next/cache";
import {
  TIERS,
  TIER_UPDATED_AT,
  type HeroRole,
  type Tier,
  type TierHero,
} from "./tier-list";

const SOURCE_URL = "https://metabot.gg/ko_KR/marvelrivals/heroes/tier-list";

// MetaBot 카드에 박히는 --tier-color 순서 = S, A, B, C, D, F
const COLOR_ORDER = ["FF4655", "FF9F43", "F5D142", "4ADE80", "5DA9F5", "9CA3AF"];
const TIER_ORDER = ["S", "A", "B", "C", "D", "F"] as const;

const MIN_HEROES = 40;

const HERO_META = new Map<string, { koName: string; role: HeroRole | null }>();
for (const tier of TIERS) {
  for (const hero of tier.heroes) {
    HERO_META.set(hero.slug, { koName: hero.koName, role: hero.role });
  }
}

type ParsedRow = {
  color: string;
  slug: string;
  name: string;
  winRate: number;
  pickRate: number;
};

function parseRows(html: string): ParsedRow[] {
  const segments = html.split(/(?=<a class="[^"]*itemCard")/).slice(1);
  const rows: ParsedRow[] = [];

  for (const segment of segments) {
    const color = segment.match(/--tier-color:#([0-9A-Fa-f]{6})/)?.[1]?.toUpperCase();
    const slug = segment.match(/hero-icons(?:%2F|\/)([a-z0-9-]+)\.(?:png|webp)/)?.[1];
    const win = segment.match(/title="[^"]*승률: ([0-9.]+)%/)?.[1];
    const pick = segment.match(/title="[^"]*픽률: ([0-9.]+)%/)?.[1];
    const name = segment.match(/title="([^"]*?) 승률:/)?.[1];

    if (!color || !slug || !win || !name) continue;

    rows.push({
      color,
      slug,
      name,
      winRate: Number(win),
      pickRate: pick ? Number(pick) : 0,
    });
  }

  return rows;
}

function buildTiers(rows: ParsedRow[]): Tier[] | null {
  if (rows.length < MIN_HEROES) return null;

  const colors = Array.from(new Set(rows.map((row) => row.color)));
  const hasExpectedTiers =
    colors.length === COLOR_ORDER.length &&
    colors.every((color, index) => color === COLOR_ORDER[index]);
  if (!hasExpectedTiers) return null;

  if (rows.some((row) => !Number.isFinite(row.winRate) || row.winRate < 30 || row.winRate > 80)) {
    return null;
  }

  const tiers: Tier[] = [];
  for (let index = 0; index < TIER_ORDER.length; index += 1) {
    const id = TIER_ORDER[index];
    const source = TIERS.find((tier) => tier.id === id);
    if (!source) return null;

    const heroes: TierHero[] = rows
      .filter((row) => row.color === COLOR_ORDER[index])
      .map((row) => {
        const meta = HERO_META.get(row.slug);
        return {
          slug: row.slug,
          name: row.name,
          koName: meta?.koName ?? row.name,
          role: meta?.role ?? null,
          winRate: row.winRate,
          pickRate: row.pickRate,
        };
      });

    if (heroes.length === 0) return null;
    tiers.push({ ...source, heroes });
  }

  return tiers;
}

async function fetchTierList(): Promise<{ tiers: Tier[]; updatedAt: string; live: boolean }> {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
        "accept-language": "ko-KR,ko;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`tier list fetch failed: ${response.status}`);

    const tiers = buildTiers(parseRows(await response.text()));
    if (!tiers) throw new Error("tier list parse rejected by validation");

    const today = new Date().toISOString().slice(0, 10);
    return { tiers, updatedAt: today, live: true };
  } catch (error) {
    console.error("[tier-list] falling back to snapshot:", error);
    return { tiers: TIERS, updatedAt: TIER_UPDATED_AT, live: false };
  }
}

export const getTierList = unstable_cache(fetchTierList, ["marvel-tier-list"], {
  revalidate: 43200,
  tags: ["tier-list"],
});
