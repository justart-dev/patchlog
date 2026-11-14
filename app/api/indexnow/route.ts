import { NextResponse } from "next/server";
import { getPatchSitemapEntries } from "@/lib/patches";
import { submitToIndexNow } from "@/lib/indexnow";

export const maxDuration = 60;

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

// 전체 사이트맵 URL을 IndexNow(네이버·Bing·Yandex)에 제출한다.
// body에 { "urls": ["/patch/123"] } 를 넘기면 해당 페이지만 제출한다.
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const requestedUrls: string[] = Array.isArray(body?.urls)
    ? body.urls.filter((url: unknown) => typeof url === "string")
    : [];

  let paths = requestedUrls;

  if (paths.length === 0) {
    try {
      const patches = await getPatchSitemapEntries();
      paths = [
        "/",
        "/patch",
        ...patches.map((patch: { id: string }) => `/patch/${patch.id}`),
      ];
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error instanceof Error ? error.message : "Failed to load sitemap",
        },
        { status: 500 }
      );
    }
  }

  const result = await submitToIndexNow(paths);

  return NextResponse.json(
    { ...result, timestamp: new Date().toISOString() },
    { status: result.ok ? 200 : 502 }
  );
}
