import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

function wantsMarkdown(req: Request): boolean {
  const method = (req as unknown as { method?: string }).method || "GET";
  if (method !== "GET" && method !== "HEAD") return false;
  const accept = req.headers.get("accept");
  if (!accept) return false;
  const mdMatch = accept.match(/text\/markdown(?:\s*;\s*q=([0-9.]+))?/i);
  if (!mdMatch) return false;
  const mdQ = mdMatch[1] ? parseFloat(mdMatch[1]!) : 1;
  if (Number.isNaN(mdQ) || mdQ === 0) return false;
  const htmlMatch = accept.match(/text\/html(?:\s*;\s*q=([0-9.]+))?/i);
  if (!htmlMatch) return true;
  const htmlQ = htmlMatch[1] ? parseFloat(htmlMatch[1]!) : 1;
  if (Number.isNaN(htmlQ)) return true;
  return mdQ >= htmlQ;
}

const clerkPublicRoute = createRouteMatcher([
  "/",
  "/patch(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/_next(.*)",
  "/(assets|images|icons|favicon.ico)(/.*)?",
  "/manifest.json",
  "/offline.html",
  "/sw.js",
  "/sitemap.xml",
  "/robots.txt",
]);

function isPublicRoute(req: Parameters<ReturnType<typeof createRouteMatcher>>[0]): boolean {
  if (clerkPublicRoute(req)) return true;
  const pathname = new URL((req as unknown as { url: string }).url).pathname;
  const isKnownPrefix =
    pathname === "/" ||
    pathname.startsWith("/patch") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    ["/manifest.json", "/offline.html", "/sw.js", "/sitemap.xml", "/robots.txt", "/favicon.ico"].includes(pathname);
  if (!isKnownPrefix) return true;
  return false;
}

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/markdown")) {
    return NextResponse.next();
  }

  const isMarkdownNegotiatedPath =
    pathname === "/" || pathname === "/patch" || pathname.startsWith("/patch/");

  if (wantsMarkdown(req as unknown as Request)) {
    const path = pathname;
    const shouldRewriteMarkdown =
      isMarkdownNegotiatedPath || !clerkPublicRoute(req as unknown as Parameters<typeof clerkPublicRoute>[0]);
    if (shouldRewriteMarkdown) {
      const url = req.nextUrl.clone();
      url.pathname = "/api/markdown";
      url.searchParams.set("path", path);
      const headers = new Headers(req.headers);
      headers.set("x-markdown-path", path);
      return NextResponse.rewrite(url, { request: { headers } });
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
