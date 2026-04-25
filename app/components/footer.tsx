import Link from "next/link";

export default function Footer() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 mb-8">
        <div className="md:col-span-7">
          <p className="mb-4 text-xl font-black tracking-tighter text-archive-zinc-950 dark:text-white">PATCHLOG</p>
          <p className="text-sm leading-relaxed text-archive-zinc-600 dark:text-archive-zinc-400 max-w-md">
            마블 라이벌즈의 실시간 패치 데이터를 정밀 분석하고 아카이빙하는 비공식 팬 서비스입니다. 가장 빠르고 정확한 한국어 번역을 제공합니다.
          </p>
        </div>

        <div className="md:col-span-5">
          <p className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-archive-zinc-400">Links</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "소개", href: "/" },
              { label: "패치노트", href: "/patch" },
              { label: "사이트 통계", href: "https://cloud.umami.is/share/X4DLIuA7E54r6Fi9" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-5 py-2.5 text-xs font-black tracking-tight rounded-full bg-archive-zinc-950 dark:bg-white text-white dark:text-archive-zinc-950 hover:scale-105 transition-transform"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-archive-zinc-200 dark:bg-archive-zinc-800/50 mb-10" />

      <div className="space-y-4 text-[11px] font-medium leading-relaxed text-archive-zinc-500 dark:text-archive-zinc-500">
        <p>© PATCHLOG. This is an unofficial fan platform and is not affiliated with NetEase Games or Marvel. All game content and copyrights belong to their respective owners.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest opacity-50">
          <span>hbd9425@gmail.com</span>
          <span>Marvel Rivals: NetEase Games</span>
          <span>Steam: Valve Corporation</span>
        </div>
      </div>
    </div>
  );
}
