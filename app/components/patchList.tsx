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
    <div className="grid gap-6 lg:grid-cols-2">
      {patchLogs.map((log, index) => {
        const publishedDate = new Date(log.published_at);
        const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: ko });
        const formattedDate = format(publishedDate, 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
        
        return (
          <Link
            key={log.id}
            href={`/patch/${log.id}`}
            className="group relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            
            <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden hover:border-slate-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex">
                {/* Image Section */}
                <div className="relative w-28 flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-slate-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100">
                        {log.app_name}
                      </span>
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
                  <h2 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-3 group-hover:text-blue-700 transition-colors">
                    {log.title}
                  </h2>

                  {/* Content Preview */}
                  {log.content && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {log.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                    </p>
                  )}

                  {/* Action */}
                  <div className="mt-auto">
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      <span>자세히 보기</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
