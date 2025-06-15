import { PatchList, type PatchLog } from "../components/patchList";

export default async function PatchPage() {
  console.log("🔥 Fetching from:", process.env.API_BASE_URL);

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/steam-patch-logs`,
    {
      next: { revalidate: 21600 },
    }
  );

  const patchLogs: PatchLog[] = await response.json();

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">패치 내역</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Marvel Rivals의 패치 내역은 UTC 기준 09:00에 적용되며, 한국 시간(KST,
          UTC+9)으로는 오후 6시쯤에 업데이트됩니다.
        </p>
        <div className="mt-8">
          <div className="text-center py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              업데이트 된 패치 내역이 없습니다
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              곧 새로운 패치 내역을 만나보실 수 있습니다.
            </p>
          </div>
          <PatchList patchLogs={patchLogs} />
        </div>
      </div>
    </section>
  );
}
