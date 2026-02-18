import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPatch, getPatchNavigation, getAllPatchIds } from '../../../lib/patches';
import PatchDetailClient from './PatchDetailClient';
import { ArticleStructuredData } from '../../components/StructuredData';
import { replaceEnglishTitles } from '../../utils/textReplacer';
import { getSkillMap } from '../../utils/skillMapService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
   const data = await getAllPatchIds();
   if (!data) return [];
   return data.map((patch: { id: string }) => ({
     id: patch.id,
   }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const patch = await getPatch(resolvedParams.id);
  if (!patch) return {};

  const title = replaceEnglishTitles(patch.title);
  const description = patch.translated_ko
    ? patch.translated_ko.replace(/<[^>]*>?/gm, '').substring(0, 160)
    : `${patch.app_name}의 최신 패치노트입니다.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patchlog.co.kr';
  const canonicalUrl = `${baseUrl}/patch/${resolvedParams.id}`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    title: `${title} | 마블 라이벌즈 패치로그`,
    description: `${description} 아이언맨, 토르, 스파이더맨, 헐크, 캡틴 아메리카 등 히어로의 스킬 변경, 맵 업데이트, 메타 변화를 상세히 확인하세요.`,
    keywords: [
      "마블 라이벌즈 패치", "Marvel Rivals patch", "히어로 밸런스", "스킬 버프", "스킬 너프",
      "아이언맨", "토르", "스파이더맨", "헐크", "캡틴 아메리카",
      "블랙위도우", "호크아이", "블랙팬서", "닥터스트레인지", "스칼렛위치",
      "맵 업데이트", "메타 변화", "티어 리스트", "공략"
    ],
    openGraph: {
      title: `${title} | 마블 라이벌즈 패치로그`,
      description: `${description} 히어로 스킬 변경, 맵 업데이트, 메타 변화 확인.`,
      type: 'article',
      publishedTime: patch.published_at,
      siteName: "패치로그",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&date=${encodeURIComponent(patch.published_at)}`,
          width: 1200,
          height: 630,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 마블 라이벌즈 패치로그`,
      description: `${description} 히어로 업데이트 확인.`,
    }
  };
}

export default async function PatchDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const patch = await getPatch(resolvedParams.id);

  if (!patch) {
    notFound();
  }

  const navigation = await getPatchNavigation(patch.id, patch.published_at);
  const skillMap = await getSkillMap();

  // Match the interface expected by PatchDetailClient
  const patchDetail = {
    ...patch,
    // Add any missing fields or transformations if necessary
  };

  return (
    <>
      <ArticleStructuredData 
        title={replaceEnglishTitles(patch.title)} 
        content={patch.translated_ko || patch.content || ''} 
        publishedAt={patch.published_at} 
        url={`https://patchlog.co.kr/patch/${patch.id}`} 
      />
      <PatchDetailClient patchDetail={patchDetail} navigation={navigation} skillMap={skillMap} />
    </>
  );
}
