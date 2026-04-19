import { PatchCollectionStructuredData } from "../components/StructuredData";
import PatchPageClient from "./PatchPageClient";
import { getLatestMarvelVideo, type LatestVideo } from "@/lib/marvel-latest-video";
import { getPatches } from "@/lib/patches";
import type { PatchLog } from "../components/patchList";

export const revalidate = 1800;

export default async function PatchPage() {
  let patchLogs: PatchLog[] = [];
  let latestVideo: LatestVideo | null = null;
  let loadError: string | null = null;

  try {
    [patchLogs, latestVideo] = await Promise.all([
      getPatches(30),
      getLatestMarvelVideo().catch(() => null),
    ]);
  } catch (error) {
    patchLogs = [];
    loadError =
      error instanceof Error
        ? "패치 로그를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요."
        : "패치 로그를 불러오는데 실패했습니다.";
  }

  return (
    <>
      <PatchCollectionStructuredData patches={patchLogs} />
      <PatchPageClient patchLogs={patchLogs} latestVideo={latestVideo} loadError={loadError} />
    </>
  );
}
