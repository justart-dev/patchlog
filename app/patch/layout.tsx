import { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: buildCanonicalUrl("/patch"),
  },
  title: "마블 라이벌즈 패치노트 목록 - 최신 업데이트와 밸런스 변경",
  description:
    "Marvel Rivals 최신 패치노트와 과거 업데이트 히스토리를 한국어로 확인하세요. 히어로 밸런스 조정, 스킬 버프/너프, 맵 변경, 시즌 업데이트를 한눈에 볼 수 있습니다.",
  keywords: [
    "마블 라이벌즈 패치노트",
    "Marvel Rivals 패치",
    "패치 히스토리",
    "업데이트 내역",
    "히어로 밸런스",
    "스킬 버프",
    "스킬 너프",
    "맵 업데이트",
    "메타 변화",
    "시즌 업데이트",
  ],
  openGraph: {
    title: "마블 라이벌즈 패치노트 목록 - 최신 업데이트와 밸런스 변경",
    description:
      "마블 라이벌즈 패치 히스토리를 한국어로 빠르게 확인하세요. 최신 패치부터 핵심 밸런스 조정까지 정리했습니다.",
    url: buildCanonicalUrl("/patch"),
    type: "website",
  },
};

export default function PatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
