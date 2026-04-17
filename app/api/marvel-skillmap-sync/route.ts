import { NextResponse } from "next/server";
import { parseSkillData, ParsedSkill } from "../../utils/skillParser";
import { getSkillMap, upsertSkillMap } from "../../utils/skillMapService";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_NAMU_URL =
  "https://namu.wiki/w/%EB%A7%88%EB%B8%94%20%EB%9D%BC%EC%9D%B4%EB%B2%8C%EC%A6%88/%EC%98%81%EC%9B%85";

const ALLOWED_HOSTS = ["namu.wiki"];
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

interface SourceFetchResult {
  text: string;
  fetchMethod: string;
}

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_HOSTS.some(
      (host) =>
        parsed.hostname === host || parsed.hostname.endsWith("." + host)
    );
  } catch {
    return false;
  }
}

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

function normalizeText(input: string): string {
  return input.replace(/\r/g, "\n").replace(/\n{2,}/g, "\n").trim();
}

function textLooksLikeSkillMap(text: string): boolean {
  return (
    text.includes("능력 정보") ||
    text.includes("패시브") ||
    text.includes("협공 스킬") ||
    text.includes("일반 공격")
  );
}

function isSecurityVerificationText(text: string): boolean {
  const lowered = text.toLowerCase();
  return (
    lowered.includes("performing security verification") ||
    lowered.includes("verify you are not a bot") ||
    lowered.includes("captcha") ||
    lowered.includes("just a moment")
  );
}

function buildProxyUrl(template: string, sourceUrl: string): string {
  if (template.includes("{url}")) {
    return template.replaceAll("{url}", encodeURIComponent(sourceUrl));
  }

  return `${template}${sourceUrl}`;
}

function getProxyCandidates(sourceUrl: string) {
  const configuredProxy = process.env.NAMUWIKI_FETCH_PROXY_URL?.trim();
  const candidates: Array<{ method: string; url: string }> = [];

  if (configuredProxy) {
    candidates.push({
      method: "proxy:configured",
      url: buildProxyUrl(configuredProxy, sourceUrl),
    });
  }

  candidates.push({
    method: "proxy:jina-ai",
    url: `https://r.jina.ai/http://${sourceUrl.replace(/^https?:\/\//, "")}`,
  });

  return candidates;
}

async function fetchTextWithHttp(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": DEFAULT_USER_AGENT,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function coerceFetchedText(rawText: string, method: string): string {
  const normalizedRaw = normalizeText(rawText);
  const asPlainText = normalizedRaw.startsWith("<")
    ? normalizeText(stripHtmlToText(normalizedRaw))
    : normalizedRaw;

  if (isSecurityVerificationText(asPlainText)) {
    throw new Error(`${method} returned anti-bot verification content`);
  }

  if (!textLooksLikeSkillMap(asPlainText)) {
    throw new Error(`${method} returned text that does not look like a skill map page`);
  }

  return asPlainText;
}

function dedupeParsedSkills(skills: ParsedSkill[]) {
  const deduped = new Map<string, ParsedSkill>();
  let duplicateCount = 0;

  skills.forEach((skill) => {
    const key = skill.englishName.trim();
    if (!key) return;
    if (deduped.has(key)) duplicateCount += 1;
    deduped.set(key, skill);
  });

  return {
    skills: Array.from(deduped.values()),
    duplicateCount,
  };
}

async function fetchSourceTextWithPlaywright(sourceUrl: string): Promise<string> {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage({
      userAgent: DEFAULT_USER_AGENT,
    });
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
    return coerceFetchedText(text, "playwright");
  } finally {
    await browser.close();
  }
}

async function fetchSourceText(sourceUrl: string): Promise<SourceFetchResult> {
  const errors: string[] = [];

  try {
    const text = await fetchSourceTextWithPlaywright(sourceUrl);
    return { text, fetchMethod: "playwright" };
  } catch (playwrightError) {
    console.warn("[skill-map-sync] playwright fetch failed, fallback to HTTP fetch:", playwrightError);
    errors.push(
      `playwright: ${playwrightError instanceof Error ? playwrightError.message : String(playwrightError)}`
    );
  }

  try {
    const html = await fetchTextWithHttp(sourceUrl);
    return {
      text: coerceFetchedText(html, "http"),
      fetchMethod: "http",
    };
  } catch (httpError) {
    console.warn("[skill-map-sync] direct HTTP fetch failed, trying proxies:", httpError);
    errors.push(`http: ${httpError instanceof Error ? httpError.message : String(httpError)}`);
  }

  for (const candidate of getProxyCandidates(sourceUrl)) {
    try {
      const rawText = await fetchTextWithHttp(candidate.url);
      return {
        text: coerceFetchedText(rawText, candidate.method),
        fetchMethod: candidate.method,
      };
    } catch (proxyError) {
      console.warn(`[skill-map-sync] ${candidate.method} failed:`, proxyError);
      errors.push(
        `${candidate.method}: ${proxyError instanceof Error ? proxyError.message : String(proxyError)}`
      );
    }
  }

  throw new Error(`source fetch failed. Attempts: ${errors.join(" | ")}`);
}

export async function GET() {
  const currentMap = await getSkillMap();
  return NextResponse.json({
    success: true,
    totalSkills: Object.keys(currentMap).length,
    defaultSourceUrl: DEFAULT_NAMU_URL,
    proxySupport: {
      env: "NAMUWIKI_FETCH_PROXY_URL",
      format: "prefix URL or template containing {url}",
    },
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

    const rawSourceUrl = body.sourceUrl || DEFAULT_NAMU_URL;
    if (!isAllowedUrl(rawSourceUrl)) {
      return NextResponse.json({ error: "Invalid sourceUrl" }, { status: 400 });
    }
    const sourceUrl = rawSourceUrl;
    const sourceLabel = body.sourceLabel || sourceUrl;
    const fetchedSource = body.rawText?.trim()
      ? { text: body.rawText.trim(), fetchMethod: "request:rawText" }
      : await fetchSourceText(sourceUrl);
    const rawText = fetchedSource.text;

    if (!rawText) {
      return NextResponse.json(
        { error: "No source text found to parse" },
        { status: 400 }
      );
    }

    const parsedSkills = parseSkillData(rawText);
    const { skills: dedupedSkills, duplicateCount } = dedupeParsedSkills(parsedSkills);

    if (dedupedSkills.length === 0) {
      return NextResponse.json(
        { error: "No skill entries were parsed from source text" },
        { status: 422 }
      );
    }

    const upsertResult = await upsertSkillMap(dedupedSkills, sourceLabel);
    if (!upsertResult.ok) {
      return NextResponse.json(
        {
          error: upsertResult.error || "Failed to upsert skill map",
          parsedCount: parsedSkills.length,
          dedupedCount: dedupedSkills.length,
          duplicateCount,
          fetchMethod: fetchedSource.fetchMethod,
        },
        { status: 500 }
      );
    }

    const currentMap = await getSkillMap();
    return NextResponse.json({
      success: true,
      parsedCount: parsedSkills.length,
      dedupedCount: dedupedSkills.length,
      duplicateCount,
      upsertedCount: upsertResult.upsertedCount,
      totalSkills: Object.keys(currentMap).length,
      source: sourceLabel,
      fetchMethod: fetchedSource.fetchMethod,
      sample: dedupedSkills.slice(0, 5),
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
