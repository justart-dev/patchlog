import { MetadataRoute } from "next";

// 패치 데이터를 가져오는 함수
async function getAllPatches() {
  // 정적 생성 시에는 절대 경로를 사용해야 함
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patchlog.vercel.app';
  const apiUrl = `${baseUrl}/api/marvel-patch-logs`;
  
  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 } // 1시간마다 재검증
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch patches from ${apiUrl}, status: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Error fetching patches from ${apiUrl}:`, error.message);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patchlog.vercel.app';
  const patches = await getAllPatches();
  
  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/patch`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 동적 패치 페이지들
  const patchPages = patches.map((patch: any) => ({
    url: `${baseUrl}/patch/${patch.id}`,
    lastModified: new Date(patch.updated_at || patch.published_at || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...patchPages];
}

export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const baseUrl = getBaseUrl();
