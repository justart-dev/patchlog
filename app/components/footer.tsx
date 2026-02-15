import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full rounded-2xl bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 sm:py-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <p className="text-sm font-extrabold text-gray-900 dark:text-white mb-2">Patchlog</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            스팀 게임 패치노트를 한국어로 읽기 쉽게 정리해 제공하는 비공식 팬 서비스입니다.
          </p>
        </div>

        <div className="md:col-span-5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">바로가기</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              소개
            </Link>
            <Link
              href="/patch"
              className="inline-flex px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              패치노트
            </Link>
            <Link
              href="https://cloud.umami.is/share/X4DLIuA7E54r6Fi9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              사이트 통계
            </Link>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

      <div className="space-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        <p>© Patchlog. 이 사이트는 Valve Corporation 또는 Steam과 관련이 없는 비공식 팬 플랫폼입니다.</p>
        <p>일부 게임 정보는 공개된 Steam 데이터를 기반으로 하며, 모든 게임 및 콘텐츠의 저작권은 해당 개발사에 있습니다.</p>
        <p>Marvel Rivals는 NetEase Games의 등록 상표이며, NetEase Games는 이 사이트의 운영이나 콘텐츠와 무관합니다.</p>
      </div>
    </footer>
  );
}
