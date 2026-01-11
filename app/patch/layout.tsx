import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마블 라이벌즈 패치노트 목록 - 전체 히스토리와 히어로 업데이트",
  description: "마블 라이벌즈(Marvel Rivals) 모든 패치노트와 업데이트 히스토리를 한글로 확인하세요. 아이언맨, 토르, 스파이더맨, 헐크, 캡틴 아메리카 등 33개 히어로의 스킬 버프/너프, 맵 변경, 메타 변화를 완전히 추적. 최신 패치부터 과거 업데이트까지.",
  keywords: [
    "마블 라이벌즈 패치노트", "Marvel Rivals 패치", "패치 히스토리", "업데이트 내역",
    "아이언맨 업데이트", "토르 업데이트", "스파이더맨 업데이트", "헐크 업데이트",
    "캡틴 아메리카 업데이트", "블랙위도우 업데이트", "호크아이 업데이트",
    "블랙팬서 업데이트", "닥터스트레인지 업데이트", "스칼렛위치 업데이트",
    "히어로 밸런스", "스킬 버프", "스킬 너프", "맵 업데이트", "메타 변화"
  ],
  openGraph: {
    title: "마블 라이벌즈 패치노트 목록 - 전체 히스토리",
    description: "마블 라이벌즈 33개 히어로의 모든 업데이트 히스토리를 한글로 확인하세요. 스킬 버프/너프, 맵 변경, 메타 변화 추적.",
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