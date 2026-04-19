import { NextResponse } from "next/server";
import { getLatestMarvelVideo } from "@/lib/marvel-latest-video";

export async function GET() {
  try {
    const latestVideo = await getLatestMarvelVideo();

    if (!latestVideo) {
      return NextResponse.json(
        { error: "라이브를 제외한 최신 영상을 찾지 못했습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(latestVideo);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "최신 유튜브 영상을 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
