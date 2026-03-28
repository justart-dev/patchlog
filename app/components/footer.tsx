import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full overflow-hidden rounded-[2rem] px-5 py-5 sm:px-6 sm:py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="mb-2 text-sm font-extrabold text-slate-900 dark:text-white">Patchlog</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            스팀 게임 패치노트를 한국어로 읽기 쉽게 정리해 제공하는 비공식 팬 서비스입니다.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            개선했으면 하는 점이나 전하고 싶은 의견이 있다면 hbd9425@gmail.com 으로 알려 주세요.
          </p>
        </div>

        <div className="md:col-span-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">바로가기</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex rounded-full bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              소개
            </Link>
            <Link
              href="/patch"
              className="inline-flex rounded-full bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              패치노트
            </Link>
            <Link
              href="/tier"
              className="inline-flex rounded-full bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              시즌 티어표
            </Link>
            <Link
              href="https://cloud.umami.is/share/X4DLIuA7E54r6Fi9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              사이트 통계
            </Link>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-200/80 dark:bg-slate-700/80" />

      <div className="space-y-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
        <p>© Patchlog. 이 사이트는 Valve Corporation 또는 Steam과 관련이 없는 비공식 팬 플랫폼입니다. 일부 게임 정보는 공개된 Steam 데이터를 기반으로 하며, 모든 게임 및 콘텐츠의 저작권은 해당 개발사에 있습니다.</p>
        <p>Marvel Rivals는 NetEase Games의 등록 상표이며, NetEase Games는 이 사이트의 운영이나 콘텐츠와 무관합니다.</p>
      </div>
    </footer>
  );
}
