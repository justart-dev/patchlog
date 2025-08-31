import { Metadata } from "next";

export const metadata: Metadata = {
  title: "패치로그 | 스팀 게임 패치노트 목록",
  description: "스팀(Steam) 게임의 모든 패치노트와 업데이트 내역을 한 곳에서 확인하세요. 마블 라이벌즈를 비롯한 다양한 게임의 최신 밸런스 패치부터 과거 업데이트까지 한글로 번역된 완전한 패치 히스토리를 제공합니다.",
  keywords: ["스팀 패치노트", "Steam 패치노트", "게임 패치 목록", "패치 히스토리", "마블 라이벌즈", "Marvel Rivals", "업데이트 내역", "밸런스 패치"],
  openGraph: {
    title: "패치로그 | 스팀 게임 패치노트 목록",
    description: "스팀 게임의 모든 패치노트와 업데이트를 한글로 제공. 완전한 패치 히스토리를 확인하세요.",
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