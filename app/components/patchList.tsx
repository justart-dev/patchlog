import Link from "next/link";
import Image from "next/image";
import { memo, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { replaceEnglishTitles } from "../utils/textReplacer";
import { formatDateKST } from "../utils/dateFormatter";

export interface PatchLog {
  id: string;
  app_name: string;
  app_gid: string;
  title: string;
  published_at: string;
  content?: string;
  translated_ko?: string;
  capsule_image: string;
}

interface PatchListProps {
  patchLogs: PatchLog[];
}

export const PatchList = memo(function PatchList({ patchLogs }: PatchListProps) {
  const formattedPatchLogs = useMemo(() => {
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    return patchLogs.map((log, index) => {
      const publishedDate = new Date(log.published_at);
      const ageMs = Date.now() - publishedDate.getTime();
      const formattedDate = formatDateKST(log.published_at, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateLabel = formatDateKST(log.published_at, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const relativeDateLabel =
        ageMs <= threeDaysMs
          ? formatDistanceToNow(publishedDate, {
              addSuffix: true,
              locale: ko,
            })
          : dateLabel;

      return {
        ...log,
        dateLabel: relativeDateLabel,
        formattedDate,
        animationDelay: `${index * 50}ms`,
      };
    });
  }, [patchLogs]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {formattedPatchLogs.map((log, index) => {
        const headerImage = log.capsule_image
          ? `https://cdn.akamai.steamstatic.com/steam/apps/${log.capsule_image.match(/\/apps\/(\d+)\//)?.[1]}/header.jpg`
          : null;

        return (
          <Link
            key={log.id}
            href={`/patch/${log.id}`}
            className="group block animate-hero-enter opacity-0"
            style={{ animationDelay: log.animationDelay, animationFillMode: 'forwards' }}
          >
            <article className="glass-card hover:border-hero-red-500/50 transition-all duration-300 group-hover:-translate-y-1 group-active:scale-[0.99] border-archive-zinc-200 dark:border-archive-zinc-800">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full aspect-video sm:aspect-auto sm:w-60 flex-shrink-0 overflow-hidden bg-transparent border-b sm:border-b-0 sm:border-r border-archive-zinc-200 dark:border-archive-zinc-800">
                  {log.capsule_image ? (
                    <Image
                      src={headerImage || log.capsule_image}
                      alt={log.app_name}
                      fill
                      className="object-contain p-2 bg-transparent transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 240px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-archive-zinc-300 dark:text-archive-zinc-700 font-black text-xs">NO DATA</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-transparent transition-opacity" />
                </div>

                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="inline-flex px-2 py-0.5 rounded bg-hero-red-500/10 text-hero-red-600 dark:text-hero-red-400 text-[10px] font-black tracking-widest uppercase">
                      {log.app_name}
                    </span>
                    <time className="text-[10px] font-bold text-archive-zinc-500 tracking-tighter" title={log.formattedDate}>
                      {log.dateLabel}
                    </time>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tighter leading-tight mb-3 group-hover:text-hero-red-500 transition-colors line-clamp-2">
                    {replaceEnglishTitles(log.title)}
                  </h2>

                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
});
