import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/marvel-patch-logs/${id}`);
    
    if (!response.ok) {
      return {
        title: "패치노트 | 마블 라이벌즈 패치로그",
        description: "마블 라이벌즈 패치노트를 확인하세요.",
      };
    }
    
    const patchDetail = await response.json();
    const cleanTitle = patchDetail.title.replace(/Marvel Rivals/gi, "마블 라이벌즈").replace(/Balance Post/gi, "밸런스 패치");
    const cleanContent = patchDetail.content ? patchDetail.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : '';
    
    return {
      title: `패치로그 | ${cleanTitle}`,
      description: `마블 라이벌즈 ${cleanTitle} 패치노트. ${cleanContent || '최신 업데이트와 밸런스 변경사항을 확인하세요.'}`,
      keywords: ["마블 라이벌즈", "패치노트", cleanTitle, "밸런스 패치", "히어로 업데이트", "스킬 변경"],
      openGraph: {
        title: `패치로그 | ${cleanTitle}`,
        description: `마블 라이벌즈 ${cleanTitle} 패치노트 - 한글 번역`,
        type: "article",
        publishedTime: patchDetail.published_at,
        authors: ["패치로그"],
      },
      twitter: {
        card: "summary_large_image",
        title: `패치로그 | ${cleanTitle}`,
        description: `마블 라이벌즈 ${cleanTitle} 패치노트`,
      },
    };
  } catch (error) {
    return {
      title: "패치로그 | 패치노트",
      description: "마블 라이벌즈 패치노트를 확인하세요.",
    };
  }
}

export default function PatchDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}