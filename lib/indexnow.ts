import { buildCanonicalUrl, SITE_URL } from "./site";

// IndexNow 키. public/{INDEXNOW_KEY}.txt 파일의 내용과 반드시 일치해야 한다.
export const INDEXNOW_KEY = "c4a9e7f2b18d6350ad4f8e2c9b7a1d63";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10000;

export type IndexNowResult = {
  submitted: number;
  ok: boolean;
  status?: number;
  error?: string;
};

export async function submitToIndexNow(paths: string[]): Promise<IndexNowResult> {
  const urls = Array.from(
    new Set(paths.filter(Boolean).map((path) => buildCanonicalUrl(path)))
  ).slice(0, MAX_URLS_PER_REQUEST);

  if (urls.length === 0) {
    return { submitted: 0, ok: true };
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: buildCanonicalUrl(`/${INDEXNOW_KEY}.txt`),
        urlList: urls,
      }),
    });

    // 200: 접수 완료, 202: 접수됐지만 키 검증 대기
    const ok = response.status === 200 || response.status === 202;

    if (!ok) {
      const body = await response.text().catch(() => "");
      console.error(`IndexNow submission failed (${response.status}): ${body}`);
    }

    return { submitted: urls.length, ok, status: response.status };
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return {
      submitted: 0,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
