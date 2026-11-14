import { MetadataRoute } from "next";
import { getPatchSitemapEntries } from "@/lib/patches";
import { buildCanonicalUrl, SITE_URL } from "@/lib/site";
import { TIER_UPDATED_AT } from "@/lib/tier-list";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const patches = await getPatchSitemapEntries();

  const staticPages = [
    {
      url: buildCanonicalUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: buildCanonicalUrl("/patch"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: buildCanonicalUrl("/tier-list"),
      lastModified: new Date(TIER_UPDATED_AT),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  const patchPages = patches.map((patch: { id: string; published_at: string; updated_at?: string | null }) => ({
    url: buildCanonicalUrl(`/patch/${patch.id}`),
    lastModified: new Date(patch.updated_at || patch.published_at || new Date().toISOString()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...patchPages];
}

export const baseUrl = SITE_URL;
