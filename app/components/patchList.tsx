import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";

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

export function PatchList({ patchLogs }: PatchListProps) {
  return (
    <div className="grid gap-6 grid-cols-1">
      {patchLogs.map((log, index) => {
        const publishedDate = new Date(log.published_at);
        const timeAgo = formatDistanceToNow(publishedDate, {
          addSuffix: true,
          locale: ko,
        });
        const formattedDate = format(publishedDate, "yyyy년 MM월 dd일 HH:mm", {
          locale: ko,
        });

        return (
          <Link
            key={log.id}
            href={`/patch/${log.id}`}
            className="group relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-all duration-200">
              <div className="flex">
                {/* Image Section */}
                <div className="relative w-28 md:w-36 flex-shrink-0 overflow-hidden bg-slate-50">
                  {log.capsule_image ? (
                    <div className="relative h-full">
                      <Image
                        src={log.capsule_image}
                        alt={log.app_name}
                        width={112}
                        height={140}
                        className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        sizes="112px"
                        priority={false}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-slate-300">
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

                {/* Content Section */}
                <div className="flex-1 p-5 md:p-6 flex flex-col min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {log.app_name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <time
                        className="text-xs text-slate-500 font-medium"
                        title={formattedDate}
                      >
                        {timeAgo}
                      </time>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-base md:text-xl font-bold text-slate-900 line-clamp-2 leading-tight mb-3 md:mb-4">
                    {log.title}
                  </h2>

                  {/* Content Preview */}
                  {log.content && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed text-sm md:text-[15px]">
                      {log.content.replace(/<[^>]*>?/gm, "").substring(0, 120)}
                      ...
                    </p>
                  )}

                  {/* Action */}
                  <div className="mt-auto">
                    <div className="flex items-center text-sm font-medium text-indigo-600">
                      <span>패치 상세 보기</span>
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Link>
        );
      })}
    </div>
  );
}
