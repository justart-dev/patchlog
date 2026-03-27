import Link from "next/link";
import Image from "next/image";
import { memo, useMemo } from "react";
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
    return patchLogs.map((log, index) => {
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

      return {
        ...log,
        dateLabel,
        formattedDate,
        animationDelay: `${index * 100}ms`,
      };
    });
  }, [patchLogs]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {formattedPatchLogs.map((log, index) => {
        const isFirst = index === 0;
        const headerImage = log.capsule_image
          ? `https://cdn.akamai.steamstatic.com/steam/apps/${log.capsule_image.match(/\/apps\/(\d+)\//)?.[1]}/header.jpg`
          : null;

        return (
          <Link
            key={log.id}
            href={`/patch/${log.id}`}
            className="group block"
            style={{ animationDelay: log.animationDelay }}
          >
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-slate-500">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full flex-shrink-0 overflow-hidden border-b border-slate-200 py-5 sm:h-auto sm:w-40 sm:border-b-0 sm:border-r dark:border-slate-700 md:w-44 lg:w-48">
                  {log.capsule_image ? (
                    isFirst && headerImage ? (
                      <div className="relative flex h-full w-full items-center justify-center px-3">
                        <Image
                          src={headerImage}
                          alt={log.app_name}
                          width={460}
                          height={215}
                          className="h-auto max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:max-w-full"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center px-3">
                        <Image
                          src={log.capsule_image}
                          alt={log.app_name}
                          width={231}
                          height={87}
                          className="h-auto max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:max-w-full"
                          priority={false}
                        />
                      </div>
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-slate-300 dark:text-slate-600">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-600 dark:text-slate-300">
                      {log.app_name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <time
                        className="text-xs"
                        title={log.formattedDate}
                      >
                        {log.dateLabel}
                      </time>
                    </div>
                  </div>

                  <h2 className="mb-3 line-clamp-2 text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-xl md:text-2xl">
                    {replaceEnglishTitles(log.title)}
                  </h2>

                  {log.content && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                      {log.content.replace(/<[^>]*>?/gm, "").substring(0, 120)}
                      ...
                    </p>
                  )}

                  <div className="mt-auto">
                    <time className="text-xs text-slate-500 dark:text-slate-400" title={log.formattedDate}>
                      {log.formattedDate}
                    </time>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
});
