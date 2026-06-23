import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OFFICIAL_NEWS_URL = "https://www.marvelrivals.com/news/";
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
    /<a[^>]+href="(https:\/\/www\.marvelrivals\.com\/gameupdate\/[^"]+\.html)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<\/a>/gi;

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
    if (html.slice(i, i + 5) === "<div") {
      depth++;
    } else if (html.slice(i, i + 6) === "</div>") {
      depth--;
      if (depth === 0) break;
    }
  }
  return html.slice(start, i + 6);
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

  const listRes = await fetch(OFFICIAL_NEWS_URL, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!listRes.ok) {
    throw new Error(`Official news list fetch failed: ${listRes.status}`);
  }
  const listHtml = await listRes.text();
  const newsList = extractNewsList(listHtml);

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
