export default function Page() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">패치 내역</h1>
      Marvel Rivals의 패치 내역은 UTC 기준 09:00에 적용되며, 한국 시간(KST,
      UTC+9)으로는 오후 6시쯤에 업데이트됩니다.
      {/* 컨텐츠 영역 */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                패치 내역을 준비 중입니다
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                곧 새로운 패치 내역을 만나보실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
