"use client";

import { useMemo, useState } from "react";
import {
  HERO_ICONS,
  ROLE_LABELS,
  type HeroRole,
  type Tier,
} from "@/lib/tier-list";

type RoleFilter = "all" | HeroRole;

const ROLE_FILTERS: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "vanguard", label: "뱅가드" },
  { id: "duelist", label: "듀얼리스트" },
  { id: "strategist", label: "스트래티지스트" },
];

export default function TierList({ tiers: source }: { tiers: Tier[] }) {
  const [role, setRole] = useState<RoleFilter>("all");

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const tier of source) {
      for (const hero of tier.heroes) {
        counts.all += 1;
        if (hero.role) counts[hero.role] = (counts[hero.role] ?? 0) + 1;
      }
    }
    return counts;
  }, [source]);

  const tiers = useMemo(
    () =>
      source
        .map((tier) => ({
          ...tier,
          heroes:
            role === "all"
              ? tier.heroes
              : tier.heroes.filter((hero) => hero.role === role),
        }))
        .filter((tier) => tier.heroes.length > 0),
    [role, source]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-1.5">
        {ROLE_FILTERS.map((filter) => {
          const isActive = role === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setRole(filter.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[11px] font-bold tracking-tight transition-colors ${
                isActive
                  ? "bg-archive-zinc-950 text-white dark:bg-white dark:text-archive-zinc-950"
                  : "bg-white text-archive-zinc-500 ring-1 ring-archive-zinc-200 hover:text-archive-zinc-950 dark:bg-archive-zinc-950 dark:text-archive-zinc-400 dark:ring-archive-zinc-800 dark:hover:text-white"
              }`}
            >
              {filter.label}
              <span
                className={`font-mono text-[10px] ${
                  isActive
                    ? "text-white/60 dark:text-archive-zinc-950/50"
                    : "text-archive-zinc-400"
                }`}
              >
                {roleCounts[filter.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {tiers.map((tier) => (
          <section
            key={tier.id}
            className="overflow-hidden rounded-sm border border-archive-zinc-200 bg-white dark:border-archive-zinc-800 dark:bg-archive-zinc-950"
          >
            <div
              className="flex items-center gap-4 border-l-[3px] px-4 py-3 sm:px-6"
              style={{ borderLeftColor: tier.color }}
            >
              <span
                className="font-mono text-2xl font-black leading-none tracking-tighter"
                style={{ color: tier.color }}
              >
                {tier.id}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black tracking-tight text-archive-zinc-950 dark:text-white">
                  {tier.label}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-archive-zinc-400">
                  {tier.heroes.length} heroes
                </p>
              </div>
            </div>

            <div className="-mb-px -mr-px grid grid-cols-3 border-t border-archive-zinc-200 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 dark:border-archive-zinc-800">
              {tier.heroes.map((hero) => (
                <div
                  key={hero.slug}
                  className="flex flex-col gap-2 border-b border-r border-archive-zinc-200 bg-white p-3 dark:border-archive-zinc-800 dark:bg-archive-zinc-950"
                >
                  <div className="flex items-start gap-2.5">
                    {HERO_ICONS[hero.slug] ? (
                      <img
                        src={HERO_ICONS[hero.slug]}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 shrink-0 rounded-sm bg-archive-zinc-100 object-cover dark:bg-archive-zinc-900"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-archive-zinc-100 font-mono text-sm font-black text-archive-zinc-400 dark:bg-archive-zinc-900">
                        {hero.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold leading-tight text-archive-zinc-950 dark:text-white">
                        {hero.koName}
                      </p>
                      <p className="truncate font-mono text-[9px] uppercase tracking-wider text-archive-zinc-400">
                        {hero.role ? ROLE_LABELS[hero.role] : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-xs font-bold text-archive-zinc-950 dark:text-white">
                      {hero.winRate.toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-archive-zinc-400">
                      PICK {hero.pickRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
