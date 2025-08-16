import { NextResponse } from "next/server";
import { BatchLogger } from "@/lib/batch-logger";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron Job 검증 (Authorization 헤더와 x-vercel-cron 헤더 체크)
  const userAgent = request.headers.get("user-agent");
  const vercelCronHeader = request.headers.get("x-vercel-cron");
  const isVercelCronByHeader = vercelCronHeader === "1" && userAgent === "vercel-cron/1.0";
  const isVercelCronByAuth = authHeader === `Bearer ${cronSecret}` && cronSecret;
  const isVercelCron = isVercelCronByAuth || isVercelCronByHeader;

  // 현재 요청의 host 정보를 사용하여 baseUrl 동적 생성
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `${protocol}://${host}`;

  // 배치 실행 시작 로그 (인증 체크 전에 로그 생성) - 모든 헤더 로깅 추가
  const allHeaders = Object.fromEntries(request.headers.entries());
  const logId = await BatchLogger.logStart("marvel-rivals-batch", {
    userAgent: request.headers.get("user-agent"),
    isVercelCron,
    isVercelCronByAuth,
    isVercelCronByHeader,
    vercelCronHeader: vercelCronHeader || "missing",
    authHeader: authHeader ? "present" : "missing",
    cronSecret: cronSecret ? "present" : "missing",
    allHeaders: allHeaders,
  });

  // Vercel Cron 인증 확인
  if (!isVercelCron) {
    if (logId) {
      await BatchLogger.logFailure(
        logId,
        "Unauthorized: Authentication failed",
        {
          userAgent,
          isVercelCron,
          isVercelCronByAuth,
          isVercelCronByHeader,
          vercelCronHeader: vercelCronHeader || "missing",
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
