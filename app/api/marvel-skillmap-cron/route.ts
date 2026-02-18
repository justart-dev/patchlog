import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  const isVercelCron = authHeader === expectedAuth;

  if (!isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { POST: syncPost } = await import("../marvel-skillmap-sync/route");
    const mockRequest = new Request("http://localhost/api/marvel-skillmap-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const response = await syncPost(mockRequest);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, stage: "skillmap-sync", error: data?.error || "sync failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      stage: "skillmap-sync",
      ...data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        stage: "skillmap-sync",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
