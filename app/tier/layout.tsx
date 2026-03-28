import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마블 라이벌즈 시즌 티어표",
  description:
    "마블 라이벌즈 시즌별 메타 티어표를 한눈에 확인하세요. 시즌마다 달라지는 핵심 픽과 티어 흐름을 이미지로 빠르게 볼 수 있습니다.",
  keywords: [
    "마블 라이벌즈 티어표",
    "Marvel Rivals tier list",
    "마블 라이벌즈 시즌 티어표",
    "메타 티어",
    "랭크 티어표",
  ],
  openGraph: {
    title: "마블 라이벌즈 시즌 티어표",
    description:
      "시즌별 메타 티어표를 이미지 아카이브로 확인하세요.",
    type: "website",
  },
};

export default function TierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
