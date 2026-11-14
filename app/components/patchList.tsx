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
  view_count?: number;
}

interface PatchListProps {
  patchLogs: PatchLog[];
}

export const PatchList = memo(function PatchList({ patchLogs }: PatchListProps) {
  const formattedPatchLogs = useMemo(() => {
    return patchLogs.map((log) => {
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
        month: "2-digit",
        day: "2-digit",
      });

      return {
        ...log,
        dateLabel,
        formattedDate,
      };
    });
  }, [patchLogs]);

  return (
    <ol className="border-t border-archive-zinc-200 dark:border-archive-zinc-800">
      {formattedPatchLogs.map((log) => (
        <li key={log.id} className="border-b border-archive-zinc-200 dark:border-archive-zinc-800">
          <a
            href={`/patch/${log.id}`}
            className="group flex items-center gap-4 sm:gap-6 py-4 transition-colors hover:bg-archive-zinc-100/70 dark:hover:bg-archive-zinc-900/50"
          >
            <time
              className="w-24 sm:w-28 shrink-0 font-mono text-[10px] sm:text-xs whitespace-nowrap text-archive-zinc-400"
              title={log.formattedDate}
            >
              {log.dateLabel}
            </time>

            <span className="min-w-0 flex-1">
              <span className="block font-bold text-sm sm:text-base tracking-tight truncate group-hover:text-hero-red-500 transition-colors">
                {replaceEnglishTitles(log.title)}
              </span>
              <span className="block mt-0.5 font-mono text-[10px] uppercase tracking-widest text-archive-zinc-400">
                {log.app_name}
                {typeof log.view_count === "number" ? (
                  <span className="ml-3 text-archive-zinc-400">VIEWS {log.view_count.toLocaleString("ko-KR")}</span>
                ) : null}
              </span>
            </span>

            <svg
              className="w-4 h-4 shrink-0 text-archive-zinc-300 dark:text-archive-zinc-700 transition-transform group-hover:translate-x-1 group-hover:text-hero-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </li>
      ))}
    </ol>
  );
});
