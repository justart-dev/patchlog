import type { Metadata } from "next";
import { buildCanonicalUrl, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_SIZE } from "@/lib/site";
import { TIER_SOURCE_URL } from "@/lib/tier-list";
import { getTierList } from "@/lib/tier-list-source";
import TierList from "./TierList";

export const revalidate = 43200;

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: buildCanonicalUrl("/tier-list"),
  },
  title: "마블 라이벌즈 티어 리스트 - 영웅 순위",
  description:
    "마블 라이벌즈 승률·픽률 기반 티어 리스트. 54명 전 영웅을 S부터 F까지 정리하고 역할별로 필터링해 확인하세요. 2026년 11월 랭크 매치 데이터 기준.",
  keywords: [
    "마블 라이벌즈 티어",
    "마블 라이벌즈 티어 리스트",
    "Marvel Rivals tier list",
    "마블 라이벌즈 승률",
    "영웅 픽률",
    "뱅가드 티어",
    "듀얼리스트 티어",
    "스트래티지스트 티어",
    "메타 티어",
  ],
  openGraph: {
    title: "마블 라이벌즈 티어 리스트 - 영웅 순위",
    description:
      "승률과 픽률로 정리한 마블 라이벌즈 54영웅 티어 리스트. 역할별 필터로 지금 메타를 확인하세요.",
    url: buildCanonicalUrl("/tier-list"),
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        ...DEFAULT_OG_IMAGE_SIZE,
        alt: "마블 라이벌즈 티어 리스트 - 패치로그",
      },
    ],
  },
};

export default async function TierListPage() {
  const { tiers, updatedAt } = await getTierList();
  const totalHeroes = tiers.reduce((sum, tier) => sum + tier.heroes.length, 0);

  const stats = [
    { label: "HEROES", value: String(totalHeroes) },
    { label: "TIERS", value: String(tiers.length) },
    { label: "UPDATED", value: updatedAt.replace(/-/g, ".") },
  ];

  return (
    <div className="px-6 pb-16 pt-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-hero-red-500 animate-hero-enter">
            Tier Index
          </p>
          <h1 className="text-4xl font-black tracking-tighter leading-[1.05] sm:text-5xl animate-hero-enter [animation-delay:100ms]">
            마블 라이벌즈
            <br />
            티어 리스트
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-archive-zinc-600 dark:text-archive-zinc-400 animate-hero-enter [animation-delay:200ms]">
            승률과 픽률로 정리한 영웅 순위입니다.
            <br />
            역할별로 걸러서 지금 메타에 바로 쓸 수 있는 픽을 확인하세요.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-1 divide-y divide-archive-zinc-200 border-y border-archive-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-archive-zinc-800 dark:border-archive-zinc-800">
          {stats.map((stat) => (
            <div key={stat.label} className="py-5 sm:px-6 sm:first:pl-0">
              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-archive-zinc-400">
                {stat.label}
              </p>
              <p className="text-2xl font-black tracking-tighter text-archive-zinc-950 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <TierList tiers={tiers} />

        <div className="mt-6 flex justify-end">
          <p className="text-xs text-archive-zinc-500 dark:text-archive-zinc-400">
            Powered by{" "}
            <a
              href={TIER_SOURCE_URL}
              target="_blank"
              rel="noopener"
              className="font-bold text-hero-red-500 underline-offset-4 hover:underline"
            >
              MetaBot.GG
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
