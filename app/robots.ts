import type { MetadataRoute } from "next";
import { buildCanonicalUrl, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: buildCanonicalUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
