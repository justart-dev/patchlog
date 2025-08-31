import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://patchlog.vercel.app";
  
  // 기본 페이지들
  let routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/patch`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // 패치 로그들을 동적으로 추가
    const response = await fetch(`${baseUrl}/api/marvel-patch-logs`);
    if (response.ok) {
      const patchLogs = await response.json();
      
      const patchRoutes: MetadataRoute.Sitemap = patchLogs.map((log: any) => ({
        url: `${baseUrl}/patch/${log.id}`,
        lastModified: new Date(log.published_at || log.synced_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
      
      routes = [...routes, ...patchRoutes];
    }
  } catch (error) {
    console.error('Failed to fetch patch logs for sitemap:', error);
  }

  return routes;
}

export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const baseUrl = getBaseUrl();
