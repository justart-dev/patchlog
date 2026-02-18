import { NextResponse } from "next/server";
import { parseSkillData } from "../../utils/skillParser";
import { getSkillMap, upsertSkillMap } from "../../utils/skillMapService";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_NAMU_URL =
  "https://namu.wiki/w/%EB%A7%88%EB%B8%94%20%EB%9D%BC%EC%9D%B4%EB%B2%8C%EC%A6%88/%EC%98%81%EC%9B%85";

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtmlToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<(br|\/p|\/li|\/h[1-6])[^>]*>/gi, "\n")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, "\n")
      .replace(/\n{2,}/g, "\n")
  );
}

async function fetchSourceTextWithPlaywright(sourceUrl: string): Promise<string> {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForTimeout(3000);

    // 나무위키 SPA 렌더링 완료 대기 (실패해도 계속 진행)
    try {
      await page.waitForFunction(
        () => {
          const text = document.body?.innerText || "";
          return text.includes("능력 정보") || text.includes("패시브") || text.includes("협공 스킬");
        },
        { timeout: 15000 }
      );
    } catch {
      // no-op
    }

    const text = await page.evaluate(() => document.body?.innerText || "");
    return text;
  } finally {
    await browser.close();
  }
}

async function fetchSourceText(sourceUrl: string): Promise<string> {
  try {
    return await fetchSourceTextWithPlaywright(sourceUrl);
  } catch (playwrightError) {
    console.warn("[skill-map-sync] playwright fetch failed, fallback to HTTP fetch:", playwrightError);
  }

  const response = await fetch(sourceUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`source fetch failed: HTTP ${response.status}`);
  }

  const html = await response.text();
  return stripHtmlToText(html);
}

export async function GET() {
  const currentMap = await getSkillMap();
  return NextResponse.json({
    success: true,
    totalSkills: Object.keys(currentMap).length,
    defaultSourceUrl: DEFAULT_NAMU_URL,
    usage: {
      method: "POST",
      body: {
        rawText: "optional string",
        sourceUrl: "optional string",
        sourceLabel: "optional string",
      },
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      rawText?: string;
      sourceUrl?: string;
      sourceLabel?: string;
    };

    const sourceUrl = body.sourceUrl || DEFAULT_NAMU_URL;
    const sourceLabel = body.sourceLabel || sourceUrl;
    const rawText = body.rawText?.trim() || (await fetchSourceText(sourceUrl));

    if (!rawText) {
      return NextResponse.json(
        { error: "No source text found to parse" },
        { status: 400 }
      );
    }

    const parsedSkills = parseSkillData(rawText);
    if (parsedSkills.length === 0) {
      return NextResponse.json(
        { error: "No skill entries were parsed from source text" },
        { status: 422 }
      );
    }

    const upsertResult = await upsertSkillMap(parsedSkills, sourceLabel);
    if (!upsertResult.ok) {
      return NextResponse.json(
        {
          error: upsertResult.error || "Failed to upsert skill map",
          parsedCount: parsedSkills.length,
        },
        { status: 500 }
      );
    }

    const currentMap = await getSkillMap();
    return NextResponse.json({
      success: true,
      parsedCount: parsedSkills.length,
      upsertedCount: upsertResult.upsertedCount,
      totalSkills: Object.keys(currentMap).length,
      source: sourceLabel,
      sample: parsedSkills.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown sync error",
      },
      { status: 500 }
    );
  }
}
