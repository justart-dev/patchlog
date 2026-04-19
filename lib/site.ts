const DEFAULT_SITE_URL = "https://patchlog.vercel.app";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
export const SITE_NAME = "패치로그";
export const SITE_BRAND_NAME = "Patchlog";
export const DEFAULT_OG_IMAGE = "/images/thumbnail.png";

export function buildCanonicalUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function stripHtml(html?: string | null) {
  return (html || "")
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
