export const dynamic = "force-dynamic";

import { PatchList, type PatchLog } from "../components/patchList";

export default async function PatchPage() {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/steam-patch-logs`,
    // {
    //   next: { revalidate: 21600 },
    // }
  );

  const patchLogs: PatchLog[] = await response.json();
  
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">패치 내역</h1>
        <p className="mb-6 text-gray-600">
          Marvel Rivals의 패치 내역은 UTC 기준 09:00에 적용되며, 한국 시간(KST,
          UTC+9)으로는 오후 6시쯤에 업데이트됩니다.
        </p>
        <div className="mt-8">
          <div className="text-center py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-600"
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              매일 업데이트 내역을 수집하고 있습니다.
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              곧 새로운 패치 내역을 만나보실 수 있습니다.
            </p>
          </div>
          <PatchList patchLogs={patchLogs} />
        </div>
      </div>
    </section>
  );
}
