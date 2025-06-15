import { format } from "date-fns";
import { ko } from "date-fns/locale";

export interface PatchLog {
  id: string;
  title: string;
  published_at: string;
  content?: string;
  app_name: string;
  app_gid: string;
}

interface PatchListProps {
  patchLogs: PatchLog[];
}

export function PatchList({ patchLogs }: PatchListProps) {
  return (
    <>
      <div className="space-y-4">
        {patchLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {log.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(log.published_at), "yyyy년 M월 d일", {
                    locale: ko,
                  })}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                {log.app_name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
