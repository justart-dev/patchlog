import { NextResponse } from "next/server";
import { BatchLogger } from "@/lib/batch-logger";

// Vercel 서버리스 함수 타임아웃 확장 (번역 배치에 충분한 시간 확보)
export const maxDuration = 60;

async function runBatch(request: Request) {
  // Vercel Cron Job 검증 (공식 Authorization 헤더 방식)
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  const isVercelCron = authHeader === expectedAuth;

  // 현재 요청의 host 정보를 사용하여 baseUrl 동적 생성
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `${protocol}://${host}`;

  // 배치 실행 시작 로그 (인증 체크 전에 로그 생성)
  const allHeaders = Object.fromEntries(request.headers.entries());
  const logId = await BatchLogger.logStart("marvel-rivals-batch", {
    userAgent: request.headers.get("user-agent"),
    isVercelCron,
    authHeader: authHeader ? "provided" : "missing",
    allHeaders: allHeaders,
  });

  // Vercel Cron 인증 확인
  if (!isVercelCron) {
    if (logId) {
      await BatchLogger.logFailure(
        logId,
        "Unauthorized: Invalid CRON_SECRET",
        {
          authHeader: authHeader ? "provided" : "missing",
          isVercelCron,
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
    const mockUpdateRequest = new Request(
      `${baseUrl}/api/marvel-patch-update`,
      {
        method: "POST",
      }
    );
    const updateResponse = await updatePost(mockUpdateRequest);
    const updateResult = await updateResponse.json();

    console.log("Update result:", updateResult);

    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }

    // 2단계: 번역 처리
    console.log("Step 2: Starting translation...");

    // 내부 API 로직을 직접 사용
    const { POST: translatePost } = await import(
      "../marvel-patch-translate/route"
    );
    const mockTranslateRequest = new Request(
      `${baseUrl}/api/marvel-patch-translate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const translateResponse = await translatePost(mockTranslateRequest);
    const translateResult = await translateResponse.json();

    console.log("Translation result:", translateResult);

    if (!translateResponse.ok) {
      throw new Error(`Translation failed: ${translateResponse.status}`);
    }

    // 번역 대상이 있었는데 하나도 번역되지 않은 경우 경고 로그
    if (translateResult.totalLogs > 0 && translateResult.translatedCount === 0) {
      console.warn(
        `Warning: ${translateResult.totalLogs} patches found but 0 translated. Check OpenAI API key and model configuration.`
      );
    }

    // 배치 성공 로그
    if (logId) {
      await BatchLogger.logSuccess(logId, {
        steamDataFetched: updateResult.success === true,
        steamItemsCount: translateResult.translatedCount || 0, // 실제 번역한 패치 수
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
          steamItemsCount: 0, // 실패시 번역 수는 0
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

// Vercel Cron은 GET 요청을 보내므로 GET에서도 배치 실행
export async function GET(request: Request) {
  return runBatch(request);
}

export async function POST(request: Request) {
  return runBatch(request);
}
