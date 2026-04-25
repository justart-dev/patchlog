import { PatchCollectionStructuredData } from "../components/StructuredData";
import PatchPageClient from "./PatchPageClient";
import { getLatestMarvelVideo, type LatestVideo } from "@/lib/marvel-latest-video";
import { getPatches } from "@/lib/patches";
import type { PatchLog } from "../components/patchList";

export const revalidate = 1800;

export default async function PatchPage() {
  const [patchLogs, latestVideo] = await Promise.all([
    getPatches(30),
    getLatestMarvelVideo().catch(() => null),
  ]);

  return (
    <>
      <PatchCollectionStructuredData patches={patchLogs} />
      <PatchPageClient patchLogs={patchLogs} latestVideo={latestVideo} />
    </>
  );
}
