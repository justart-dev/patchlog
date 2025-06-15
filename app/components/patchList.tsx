import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

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
          <Link
            key={log.id}
            href={`/patch/${log.id}`}
            className="block bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="order-2 sm:order-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {log.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {format(new Date(log.published_at), "yyyy년 M월 d일", {
                    locale: ko,
                  })}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border self-start sm:self-auto order-1 sm:order-2 bg-gray-50 text-gray-800 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[120px] sm:max-w-none">
                {log.app_name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
