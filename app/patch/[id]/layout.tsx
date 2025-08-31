import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // 빌드 시에는 기본 메타데이터만 반환
  return {
    title: "패치로그 | 마블 라이벌즈 패치노트",
    description: "마블 라이벌즈 패치노트를 한글로 확인하세요. 최신 업데이트와 밸런스 변경사항을 놓치지 마세요.",
    keywords: ["마블 라이벌즈", "패치노트", "Marvel Rivals", "밸런스 패치", "히어로 업데이트", "스킬 변경"],
    openGraph: {
      title: "패치로그 | 마블 라이벌즈 패치노트",
      description: "마블 라이벌즈 패치노트 - 한글 번역",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "패치로그 | 마블 라이벌즈 패치노트",
      description: "마블 라이벌즈 패치노트",
    },
  };
}

export default function PatchDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}