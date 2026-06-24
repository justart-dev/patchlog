import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OFFICIAL_CATEGORIES = [
  "https://www.marvelrivals.com/gameupdate/",
  "https://www.marvelrivals.com/devdiaries/",
  "https://www.marvelrivals.com/balancepost/",
  "https://www.marvelrivals.com/announcements/",
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, "").trim();
}

function extractNewsList(html: string): { title: string; url: string }[] {
  const results: { title: string; url: string }[] = [];
  const regex =
    /<a[^>]+href="(https:\/\/www\.marvelrivals\.com\/(?:gameupdate|devdiaries|balancepost|announcements)\/[^"]+\.html)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<\/a>/gi;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    const title = stripHtmlTags(match[2]);
    if (url && title) {
      results.push({ title, url });
    }
  }
  return results;
}

function extractContent(html: string): string | null {
  const marker = '<div class="art-inner-content">';
  const start = html.indexOf(marker);
  if (start === -1) return null;

  let depth = 0;
  let i = start;
  for (; i < html.length; i++) {
    if (html.slice(i, i + 4) === "<div") {
      depth++;
    } else if (html.slice(i, i + 6) === "</div>") {
      depth--;
      if (depth === 0) break;
    }
  }
  return cleanContent(html.slice(start, i + 6));
}

function getAttr(tag: string, name: string): string {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return match ? match[1] : "";
}

function classAttrIncludes(tag: string, cls: string): boolean {
  const m = tag.match(/class=["']([^"']*)["']/i);
  if (!m) return false;
  return m[1].split(/\s+/).includes(cls);
}

function classAttrIncludesAll(tag: string, classes: string[]): boolean {
  return classes.every((cls) => classAttrIncludes(tag, cls));
}

type ClassSelector = string | string[];

function removeDivBlocks(content: string, classNames: ClassSelector[]): string {
  const result: string[] = [];
  let i = 0;
  while (i < content.length) {
    if (content.slice(i, i + 4) === "<div") {
      const tagEnd = content.indexOf(">", i);
      if (tagEnd === -1) {
        result.push(content.slice(i));
        break;
      }
      const tag = content.slice(i, tagEnd + 1);
      const shouldRemove = classNames.some((selector) =>
        Array.isArray(selector)
          ? classAttrIncludesAll(tag, selector)
          : classAttrIncludes(tag, selector)
      );
      if (shouldRemove) {
        let depth = 1;
        let j = tagEnd + 1;
        for (; j < content.length; j++) {
          if (content.slice(j, j + 4) === "<div") depth++;
          else if (content.slice(j, j + 6) === "</div>") {
            depth--;
            if (depth === 0) break;
          }
        }
        i = j + 6;
        continue;
      }
      result.push(tag);
      i = tagEnd + 1;
      continue;
    }
    result.push(content[i]);
    i++;
  }
  return result.join("");
}

function cleanContent(content: string): string {
  // 1) 영상 플레이어 블럹을 HTML5 <video> 태그로 변환 (속성 순서 무관)
  content = content.replace(
    /<div[^>]*class=["']video_ctn["'][^>]*>/gi,
    (match) => {
      const hdUrl = getAttr(match, "data-hdmovieurl");
      const sdUrl = getAttr(match, "data-movieurl");
      const poster = getAttr(match, "data-startimg");
      const width = getAttr(match, "data-width") || "100%";
      const height = getAttr(match, "data-height") || "auto";
      const src = hdUrl || sdUrl;
      if (!src) return "";
      const sources: string[] = [];
      if (hdUrl) sources.push(`<source src="${hdUrl}" type="video/mp4" />`);
      if (sdUrl && sdUrl !== hdUrl) sources.push(`<source src="${sdUrl}" type="video/mp4" />`);
      return `<video controls poster="${poster}" width="${width}" height="${height}" style="max-width:100%;height:auto;border-radius:0.875rem;margin:2rem auto;display:block;">${sources.join("")}</video>`;
    }
  );

  // 2) 푸터, 팝업, 드롤용 바 등 제거
  content = removeDivBlocks(content, [
    "footer",
    ["popup", "popup-email"],
    "Layer",
    ["commig-pop", "pop"],
    "line",
    "go-top",
  ]);

  // 3) 스크립트/스타일/링크/주석 제거
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  content = content.replace(/<link[^>]*>/gi, "");
  content = content.replace(/<!--[\s\S]*?-->/g, "");

  // 4) 공통 푸터 소셜 링크 블록 제거
  const socialLinks = [
    "Discord",
    "X",
    "Facebook",
    "Instagram",
    "TikTok",
    "YouTube",
    "Twitch",
    "트위치",
  ];
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
    const textOnly = inner.replace(/<[^>]+>/g, "").replace(/[\s|]+/g, "");
    if (textOnly === "") return "";
    const hasSocial = socialLinks.some((platform) =>
      new RegExp(`<a[^>]*>${platform}<\\/a>`, "i").test(inner)
    );
    return hasSocial ? "" : match;
  });

  // 5) 빈 &nbsp; 문단 정리
  content = content.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "");

  return content.trim();
}

async function fetchCategoryList(categoryUrl: string): Promise<{ title: string; url: string }[]> {
  const res = await fetch(categoryUrl, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`Category fetch failed: ${categoryUrl} -> ${res.status}`);
  }
  const html = await res.text();
  return extractNewsList(html);
}

async function crawlOfficialPatchLogs() {
  const { data: patches, error } = await supabase
    .from("steam_patch_logs")
    .select("id,title")
    .is("content", null)
    .order("published_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  if (!patches || patches.length === 0) {
    return { crawled: 0, total: 0, results: [] };
  }

  const listArrays = await Promise.all(
    OFFICIAL_CATEGORIES.map((url) => fetchCategoryList(url))
  );
  const newsMap = new Map<string, { title: string; url: string }>();
  for (const arr of listArrays) {
    for (const item of arr) {
      if (!newsMap.has(item.url)) {
        newsMap.set(item.url, item);
      }
    }
  }
  const newsList = Array.from(newsMap.values());

  const results: any[] = [];
  for (const patch of patches) {
    const normalizedSteam = normalizeTitle(patch.title);
    const matched = newsList.find((news) => {
      const normalizedOfficial = normalizeTitle(news.title);
      return (
        normalizedOfficial.includes(normalizedSteam) ||
        normalizedSteam.includes(normalizedOfficial)
      );
    });

    if (!matched) {
      results.push({
        id: patch.id,
        title: patch.title,
        status: "no_match",
      });
      continue;
    }

    const detailRes = await fetch(matched.url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!detailRes.ok) {
      results.push({
        id: patch.id,
        title: patch.title,
        status: "fetch_error",
        url: matched.url,
        httpStatus: detailRes.status,
      });
      continue;
    }

    const detailHtml = await detailRes.text();
    const content = extractContent(detailHtml);

    if (!content) {
      results.push({
        id: patch.id,
        title: patch.title,
        status: "no_content",
        url: matched.url,
      });
      continue;
    }

    const { error: updateError } = await supabase
      .from("steam_patch_logs")
      .update({ content })
      .eq("id", patch.id);

    if (updateError) {
      results.push({
        id: patch.id,
        title: patch.title,
        status: "update_error",
        url: matched.url,
        error: updateError.message,
      });
    } else {
      results.push({
        id: patch.id,
        title: patch.title,
        status: "success",
        url: matched.url,
      });
    }
  }

  return {
    crawled: results.filter((r) => r.status === "success").length,
    total: patches.length,
    results,
  };
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await crawlOfficialPatchLogs();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Crawl failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
