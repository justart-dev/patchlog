import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { memo, useMemo } from "react";
import { replaceEnglishTitles } from "../utils/textReplacer";

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
      const publishedDate = new Date(log.published_at);
      const timeAgo = formatDistanceToNow(publishedDate, {
        addSuffix: true,
        locale: ko,
      });
      const formattedDate = format(publishedDate, "yyyy년 MM월 dd일 HH:mm", {
        locale: ko,
      });

      return {
        ...log,
        publishedDate,
        timeAgo,
        formattedDate,
        animationDelay: `${index * 100}ms`,
      };
    });
  }, [patchLogs]);

  return (
    <div className="grid gap-4 grid-cols-1">
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
            <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-32 md:w-40 lg:w-44 py-5 sm:py-0 sm:h-auto flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-hidden">
                  {log.capsule_image ? (
                    isFirst && headerImage ? (
                      <div className="relative h-full w-full flex items-center justify-center px-3">
                        <Image
                          src={headerImage}
                          alt={log.app_name}
                          width={460}
                          height={215}
                          className="max-w-[200px] sm:max-w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="relative h-full w-full flex items-center justify-center px-3">
                        <Image
                          src={log.capsule_image}
                          alt={log.app_name}
                          width={231}
                          height={87}
                          className="max-w-[200px] sm:max-w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          priority={false}
                        />
                      </div>
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-300 dark:text-gray-600">
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

                <div className="flex-1 p-5 md:p-6 flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {log.app_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <time
                        className="text-xs text-gray-500 dark:text-gray-400"
                        title={log.formattedDate}
                      >
                        {log.timeAgo}
                      </time>
                    </div>
                  </div>

                  <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-3">
                    {replaceEnglishTitles(log.title)}
                  </h2>

                  {log.content && (
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                      {log.content.replace(/<[^>]*>?/gm, "").substring(0, 120)}
                      ...
                    </p>
                  )}

                  <div className="mt-auto">
                    <time className="text-xs text-gray-500 dark:text-gray-400" title={log.formattedDate}>
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
