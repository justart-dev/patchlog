export type TierChart = {
  slug: string;
  title: string;
  seasonLabel: string;
  updatedAt: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  sourceLabel?: string;
};

// Add a new entry here whenever a new season chart image is ready.
export const tierCharts: TierChart[] = [
  {
    slug: "season-7",
    title: "시즌 7 메타 티어표",
    seasonLabel: "Season 7",
    updatedAt: "2025-03-28",
    description:
      "사용자 제공 이미지를 기준으로 정리한 시즌 7 티어표입니다. 현재 메타 흐름을 한눈에 빠르게 확인할 수 있습니다.",
    imageSrc: "/images/tier/season7.png",
    imageAlt: "마블 라이벌즈 시즌 7 티어표",
    sourceLabel: "사용자 제공 이미지",
  },
];
