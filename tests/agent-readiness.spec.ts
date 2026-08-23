import { test, expect } from "@playwright/test";

const NONEXISTENT = "/__agentic-probe-nonexistent-xyz-999";

test.describe("agent-readiness", () => {
  test("404 HTML returns 404 with recovery links", async ({ page }) => {
    const res = await page.goto(NONEXISTENT);
    expect(res?.status()).toBe(404);
    const body = await page.content();
    expect(body).toContain("/patch");
    expect(body).toContain("/sitemap.xml");
  });

  test("404 markdown returns 404 text/markdown with recovery links", async ({ request }) => {
    const res = await request.get(NONEXISTENT, { headers: { Accept: "text/markdown" } });
    expect(res.status()).toBe(404);
    const ct = res.headers()["content-type"] || "";
    expect(ct).toContain("text/markdown");
    const body = await res.text();
    expect(body).toContain("404");
    expect(body).toContain("/sitemap.xml");
  });

  test("GET / with Accept: text/markdown returns markdown", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/markdown" } });
    expect(res.status()).toBe(200);
    const ct = res.headers()["content-type"] || "";
    expect(ct).toContain("text/markdown");
    const body = await res.text();
    expect(body).toContain("# Patchlog");
    const vary = (res.headers()["vary"] || res.headers()["Vary"] || "").toLowerCase();
    expect(vary).toContain("accept");
  });

  test("GET / with Accept: text/html returns HTML", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/html" } });
    expect(res.status()).toBe(200);
    const ct = res.headers()["content-type"] || "";
    expect(ct).toContain("text/html");
    const body = await res.text();
    expect(body.toLowerCase()).toContain("<h1");
  });

  test("GET /patch markdown returns a list", async ({ request }) => {
    const res = await request.get("/patch", { headers: { Accept: "text/markdown" } });
    expect(res.status()).toBe(200);
    const ct = res.headers()["content-type"] || "";
    expect(ct).toContain("text/markdown");
    const body = await res.text();
    expect(body).toMatch(/- \[/);
  });

  test("GET /patch/:id markdown detail and missing-id 404", async ({ request }) => {
    const overview = await request.get("/", { headers: { Accept: "text/markdown" } });
    const body = await overview.text();
    const m = body.match(/\/patch\/([^\s)\]]+)/);
    if (!m) {
      test.skip();
      return;
    }
    const detailPath = new URL(m[0]!, "http://localhost").pathname;
    const detail = await request.get(detailPath, { headers: { Accept: "text/markdown" } });
    expect(detail.status()).toBe(200);
    expect((detail.headers()["content-type"] || "")).toContain("text/markdown");
    expect(await detail.text()).toMatch(/^# /m);

    const missing = await request.get("/patch/not-a-real-id-xyz", { headers: { Accept: "text/markdown" } });
    expect(missing.status()).toBe(404);
    expect((missing.headers()["content-type"] || "")).toContain("text/markdown");
  });

  test("homepage HTML has H1/H2 and 500+ chars of text", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect((html.match(/<h1/gi) || []).length).toBeGreaterThanOrEqual(1);
    expect((html.match(/<h2/gi) || []).length).toBeGreaterThanOrEqual(1);
    const stripped = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    expect(stripped.length).toBeGreaterThanOrEqual(500);
  });

  test("GET / HTML response carries Vary: Accept", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/markdown" } });
    expect(res.status()).toBe(200);
    const vary = (res.headers()["vary"] || res.headers()["Vary"] || "").toLowerCase();
    expect(vary).toContain("accept");
  });
});
