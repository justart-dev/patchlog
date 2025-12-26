import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPatch, getPatchNavigation, getAllPatchIds } from '../../../lib/patches';
import PatchDetailClient from './PatchDetailClient';
import { ArticleStructuredData } from '../../components/StructuredData';
import { replaceEnglishTitles } from '../../utils/textReplacer';

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
  
  return {
    title: `${title} | 패치로그`,
    description,
    openGraph: {
      title: `${title} | 패치로그`,
      description,
      type: 'article',
      publishedTime: patch.published_at,
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
      title: `${title} | 패치로그`,
      description,
      
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
      <PatchDetailClient patchDetail={patchDetail} navigation={navigation} />
    </>
  );
}
