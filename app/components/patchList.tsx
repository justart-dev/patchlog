import { format } from "date-fns";
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
      <div className="space-y-4">
        {patchLogs.map((log) => (
          <Link
            key={log.id}
            href={`/patch/${log.id}`}
            className="block bg-white rounded-lg shadow-sm p-3 border border-gray-200"
          >
            <div className="flex flex-row gap-4">
              <div className="flex-shrink-0 w-36 h-20 flex items-center justify-center">
                {log.capsule_image ? (
                  <Image
                    src={log.capsule_image}
                    alt={log.app_name}
                    width={200}
                    height={112}
                    className="rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="text-sm font-normal text-gray-900">
                  {log.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
