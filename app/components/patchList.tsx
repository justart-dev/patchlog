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
  translated_ko? : string;
  capsule_image : string;
}

interface PatchListProps {
  patchLogs: PatchLog[];
}

export function PatchList({ patchLogs }: PatchListProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {patchLogs.map((log) => {
          const publishedDate = new Date(log.published_at);
          const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: ko });
          const formattedDate = format(publishedDate, 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
          
          return (
            <Link
              key={log.id}
              href={`/patch/${log.id}`}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 hover:border-blue-100"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="relative w-full sm:w-32 h-28 sm:h-full min-h-[112px] flex-shrink-0 overflow-hidden bg-gray-50">
                  {log.capsule_image ? (
                    <>
                      <Image
                        src={log.capsule_image}
                        alt={log.app_name}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 160px, 160px"
                        priority={false}
                      />
                      <div className="absolute inset-0 border-r border-gray-100" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="text-gray-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-medium px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full whitespace-nowrap">
                      {log.app_name}
                    </span>
                    <time 
                      className="text-xs text-gray-500" 
                      title={formattedDate}
                    >
                      {timeAgo}
                    </time>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors break-words">
                    {log.title}
                  </h2>
                  {log.content && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-auto leading-relaxed">
                      {log.content.replace(/<[^>]*>?/gm, '')}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-blue-600 font-medium flex items-center">
                    패치 상세 보기
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
