import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const testMode = searchParams.get("test") === "true";

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron Job 검증 (User-Agent 또는 특정 헤더 체크)
  const userAgent = request.headers.get("user-agent");
  const isVercelCron =
    userAgent?.includes("vercel-cron") ||
    request.headers.get("x-vercel-cron") === "1";

  // 테스트 모드가 아니고 Vercel Cron이 아닐 때만 인증 확인
  if (!testMode && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  try {
    console.log("Starting Marvel Rivals batch process...");

    // 1단계: 패치 데이터 업데이트
    console.log("Step 1: Updating patch data...");
    const updateResponse = await fetch(`${baseUrl}/api/marvel-patch-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }

    const updateResult = await updateResponse.json();
    console.log("Update result:", updateResult);

    let translateResult: { message: string } | null = null;

    if (!testMode) {
      // 2단계: 번역 처리 (실제 모드에서만)
      console.log("Step 2: Starting translation...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5초 대기

      const translateResponse = await fetch(
        `${baseUrl}/api/marvel-patch-translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!translateResponse.ok) {
        throw new Error(`Translation failed: ${translateResponse.status}`);
      }

      translateResult = await translateResponse.json();
      console.log("Translation result:", translateResult);
    } else {
      console.log("Step 2: Skipping translation in test mode");
      translateResult = { message: "Translation skipped in test mode" };
    }

    return NextResponse.json({
      success: true,
      testMode,
      timestamp: new Date().toISOString(),
      results: {
        update: updateResult,
        translate: translateResult,
      },
    });
  } catch (error) {
    console.error("Batch process failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET 요청으로도 테스트 가능하게 (개발용)
export async function GET() {
  return NextResponse.json({
    message: "Marvel Rivals Batch API",
    status: "ready",
    timestamp: new Date().toISOString(),
  });
}
