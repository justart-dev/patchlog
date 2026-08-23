import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { SITE_URL, SITE_BRAND_NAME, buildCanonicalUrl } from "./site";

let turndown: TurndownService | null = null;

function getTurndown() {
  if (turndown) return turndown;
  const svc = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  svc.use(gfm);
  svc.addRule("br", {
    filter: "br",
    replacement: () => "  \n",
  });
  svc.remove("script");
  svc.remove("style");
  turndown = svc;
  return svc;
}

export function htmlToMarkdown(html?: string | null) {
  if (!html) return "";
  const md = getTurndown().turndown(html).trim();
  return md;
}

export function buildMarkdown404(requestPath: string) {
  const canon = buildCanonicalUrl("/");
  const patchList = buildCanonicalUrl("/patch");
  const sitemap = buildCanonicalUrl("/sitemap.xml");
  return (
    `# 404 — 페이지를 찾을 수 없습니다 (Not Found)\n\n` +
    `요청한 경로 \`${requestPath}\`는 존재하지 않습니다.\n\n` +
    `## 다음 위치를 확인해 보세요 (Where to look next)\n\n` +
    `- [홈 / Home](${canon})\n` +
    `- [전체 패치노트 목록 / Patch list](${patchList})\n` +
    `- [사이트맵 / Sitemap](${sitemap})\n`
  );
}

export type PatchSummary = {
  id: string;
  title: string;
  published_at: string;
};

export function buildSiteOverviewMarkdown(patches: PatchSummary[]) {
  const list = patches.length
    ? patches.map((p) => `- [${escapeMdLinkText(p.title)}](${buildCanonicalUrl(`/patch/${p.id}`)}) — ${formatDate(p.published_at)}`).join("\n")
    : "_아직 등록된 패치가 없습니다._";
  return (
    `# ${SITE_BRAND_NAME} (패치로그)\n\n` +
    `> 마블 라이벌즈(Marvel Rivals) 한글 패치노트 사이트. Steam과 공식 홈페이지를 12시간마다 확인해 새 패치를 수집·번역해 한국어로 제공합니다.\n\n` +
    `Patchlog translates Marvel Rivals patch notes into Korean and publishes them at predictable URLs.\n\n` +
    `All pages are also available as Markdown via \`Accept: text/markdown\` content negotiation ` +
    `(add \`Vary: Accept\` semantics — CDN-safe).\n\n` +
    `## 최신 패치노트 (Latest patches)\n\n` +
    `${list}\n\n` +
    `- [전체 목록 / Full list](${buildCanonicalUrl("/patch")})\n` +
    `- [사이트맵 / Sitemap](${buildCanonicalUrl("/sitemap.xml")})\n`
  );
}

export function buildPatchListMarkdown(patches: PatchSummary[]) {
  const header =
    `# 패치노트 목록 / Patch list\n\n` +
    `게시일 순으로 정렬된 전체 패치노트입니다. 각 항목의 링크에서 상세 내용을 확인하세요.\n\n`;
  if (!patches.length) return header + "_아직 등록된 패치가 없습니다._\n";
  const items = patches.map((p) => `- [${escapeMdLinkText(p.title)}](${buildCanonicalUrl(`/patch/${p.id}`)}) — ${formatDate(p.published_at)}`).join("\n");
  return header + items + "\n";
}

export function buildPatchDetailMarkdown(p: {
  id: string;
  title: string;
  published_at: string;
  url?: string | null;
  translated_ko?: string | null;
  content?: string | null;
}) {
  const canon = buildCanonicalUrl(`/patch/${p.id}`);
  const published = formatDate(p.published_at);
  const sourceLine = p.url ? `원문 / Source: ${p.url}\n\n` : "";
  const canonLine = `HTML: ${canon}\n\n`;
  const bodyMd = htmlToMarkdown(p.translated_ko || p.content);
  return (
    `# ${escapeMdLinkText(p.title)}\n\n` +
    `게시일: ${published} · Patchlog\n\n` +
    sourceLine +
    canonLine +
    (bodyMd ? bodyMd + "\n" : "_본문 없음_\n")
  );
}

function escapeMdLinkText(s: string) {
  return s.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}
