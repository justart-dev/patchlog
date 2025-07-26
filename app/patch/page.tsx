"use client";

import { useEffect, useState } from "react";
import { PatchList, type PatchLog } from "../components/patchList";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PatchPage() {
  const [patchLogs, setPatchLogs] = useState<PatchLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatchLogs = async () => {
      try {
        const response = await fetch(
          '/api/marvel-patch-logs'
          // { next: { revalidate: 21600 } }
        );
        
        if (!response.ok) {
          throw new Error("패치 로그를 불러오는데 실패했습니다.");
        }
        
        const data = await response.json();
        setPatchLogs(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatchLogs();
  }, []);

  // Get the latest update date from patch logs
  const latestDate = patchLogs && patchLogs.length > 0
    ? new Date(
        Math.max(
          ...patchLogs.map((log) => new Date(log.published_at).getTime())
        )
      )
    : new Date();
    
  if (loading) {
    return <LoadingSpinner message="패치 목록을 불러오는 중..." className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Marvel Rivals
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              패치 내역은 UTC 기준 09:00에 적용되며, 한국 시간으로는 오후
              6시쯤에 업데이트됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {patchLogs ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                최근 패치 노트
              </h2>
              <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  마지막 업데이트: {latestDate.toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            <PatchList patchLogs={patchLogs} />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="absolute top-1 right-1/2 transform translate-x-8 w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              패치 내역을 수집하고 있습니다
            </h3>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              매일 자동으로 Marvel Rivals의 최신 패치 노트를 수집하여 한글로
              번역합니다. 곧 새로운 내용을 만나보실 수 있습니다.
            </p>

            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-100 rounded-full text-sm text-slate-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
              </div>
              <span>업데이트 대기 중</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
