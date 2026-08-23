import { NextRequest, NextResponse } from "next/server";
import { getPatch, getPatches } from "@/lib/patches";
import {
  buildMarkdown404,
  buildPatchDetailMarkdown,
  buildPatchListMarkdown,
  buildSiteOverviewMarkdown,
} from "@/lib/markdown";

export const runtime = "nodejs";

const COMMON_HEADERS = {
  "Vary": "Accept, Accept-Encoding",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
};

function markdownResponse(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      ...COMMON_HEADERS,
    },
  });
}

export async function GET(req: NextRequest) {
  const rawPath =
    req.headers.get("x-markdown-path") ||
    new URL(req.url).searchParams.get("path") ||
    req.nextUrl.searchParams.get("path") ||
    (() => {
      const h = req.headers.get("x-middleware-rewrite") || req.headers.get("x-matched-path") || "";
      try {
        if (h.includes("path=")) return new URL(h, "http://localhost").searchParams.get("path") || "";
      } catch {}
      return "";
    })() ||
    "/";
  const path = rawPath.split("?")[0]!.split("#")[0]! || "/";

  if (path === "/" || path === "") {
    const patches = await getPatches(5).catch(() => []);
    return markdownResponse(buildSiteOverviewMarkdown(patches as any));
  }

  if (path === "/patch") {
    const patches = await getPatches(100).catch(() => []);
    return markdownResponse(buildPatchListMarkdown(patches as any));
  }

  const patchIdMatch = path.match(/^\/patch\/([^/]+)\/?$/);
  if (patchIdMatch) {
    const id = decodeURIComponent(patchIdMatch[1] as string);
    const patch = await getPatch(id).catch(() => null);
    if (!patch) {
      return markdownResponse(buildMarkdown404(path), 404);
    }
    return markdownResponse(
      buildPatchDetailMarkdown(patch as any)
    );
  }

  return markdownResponse(buildMarkdown404(path), 404);
}
