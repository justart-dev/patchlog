import { NextResponse } from "next/server";
import { BatchLogger } from "@/lib/batch-logger";

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

  // 현재 요청의 host 정보를 사용하여 baseUrl 동적 생성
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `${protocol}://${host}`;

  // 배치 실행 시작 로그 (인증 체크 전에 로그 생성)
  const logId = await BatchLogger.logStart("marvel-rivals-batch", {
    testMode,
    userAgent: request.headers.get("user-agent"),
    isVercelCron,
    authHeader: authHeader ? "present" : "missing",
    cronSecret: cronSecret ? "present" : "missing",
  });

  // 테스트 모드가 아니고 Vercel Cron이 아닐 때만 인증 확인
  if (!testMode && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    if (logId) {
      await BatchLogger.logFailure(
        logId,
        "Unauthorized: Authentication failed",
        {
          testMode,
          userAgent,
          isVercelCron,
          authHeader: authHeader ? "present" : "missing",
          cronSecret: cronSecret ? "present" : "missing",
        }
      );
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting Marvel Rivals batch process...");

    // 1단계: 패치 데이터 업데이트 (직접 호출)
    console.log("Step 1: Updating patch data...");
    
    // 내부 API 로직을 직접 사용
    const { POST: updatePost } = await import("../marvel-patch-update/route");
    const mockUpdateRequest = new Request(`${baseUrl}/api/marvel-patch-update`, {
      method: "POST",
    });
    const updateResponse = await updatePost(mockUpdateRequest);
    const updateResult = await updateResponse.json();
    
    console.log("Update result:", updateResult);
    
    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }

    // 2단계: 번역 처리
    console.log("Step 2: Starting translation...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5초 대기

    // 내부 API 로직을 직접 사용
    const { POST: translatePost } = await import("../marvel-patch-translate/route");
    const mockTranslateRequest = new Request(`${baseUrl}/api/marvel-patch-translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const translateResponse = await translatePost(mockTranslateRequest);
    const translateResult = await translateResponse.json();
    
    console.log("Translation result:", translateResult);
    
    if (!translateResponse.ok) {
      throw new Error(`Translation failed: ${translateResponse.status}`);
    }

    // 배치 성공 로그
    if (logId) {
      await BatchLogger.logSuccess(logId, {
        testMode,
        steamDataFetched: updateResult.success === true,
        steamItemsCount: updateResult.inserted || 0,
        results: {
          update: updateResult,
          translate: translateResult,
        },
      });
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
    
    // 배치 실패 로그
    if (logId) {
      await BatchLogger.logFailure(
        logId,
        error instanceof Error ? error.message : "Unknown error",
        {
          testMode,
          steamDataFetched: false,
          steamItemsCount: 0,
          stack: error instanceof Error ? error.stack : undefined,
        }
      );
    }

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
