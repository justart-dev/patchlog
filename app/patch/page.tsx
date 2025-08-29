"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PatchList, type PatchLog } from "../components/patchList";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusDisplay from "../components/StatusDisplay";
import { useUser, SignInButton } from "@clerk/nextjs";
import { ChartBarIcon, FireIcon } from "@heroicons/react/24/outline";

export default function PatchPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [patchLogs, setPatchLogs] = useState<PatchLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatchLogs = async () => {
      try {
        const response = await fetch(
          "/api/marvel-patch-logs",
          { next: { revalidate: 1800 } } // 30분(1800초)마다 재검증
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

  const latestDate =
    patchLogs && patchLogs.length > 0
      ? new Date(
          Math.max(
            ...patchLogs.map((log) => new Date(log.published_at).getTime())
          )
        )
      : new Date();

  if (loading) {
    return (
      <LoadingSpinner
        message="패치 목록을 불러오는 중..."
        className="min-h-screen"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <StatusDisplay
          title="오류 발생"
          message={error}
          variant="error"
          showHomeButton
          showRetryButton
          onRetry={() => window.location.reload()}
          className="py-12"
        />
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
            {/* Update Insights Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  업데이트 인사이트
                </h2>
                <div className="relative">
                  <div className="inline-flex items-center px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-sm transform rotate-3 shadow-md border-2 border-yellow-500">
                    NEW
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Update Pattern Card */}
                <div className="relative h-full flex flex-col bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  {isLoaded && !isSignedIn && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ChartBarIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">
                          업데이트 패턴 분석
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          로그인하고 상세한 업데이트 패턴을 확인하세요
                        </p>
                        <SignInButton mode="modal">
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            로그인하기
                          </button>
                        </SignInButton>
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    업데이트 패턴
                  </h3>

                  <p className="text-slate-600 text-sm mb-4">
                    최근 30일간의 업데이트 빈도입니다. 주로 업데이트가 많이
                    이루어지는 요일을 확인하실 수 있습니다.
                  </p>

                  <div className="grid grid-cols-7 gap-4 mt-8">
                    {["일", "월", "화", "수", "목", "금", "토"].map(
                      (day, index) => {
                        // Count updates for each day of the week (0-6, where 0 is Sunday)
                        const dayCount = patchLogs.filter((log) => {
                          const dayOfWeek = new Date(log.published_at).getDay();
                          return dayOfWeek === index;
                        }).length;

                        // Calculate height based on count (further increased max height)
                        const maxHeight = 48; // Increased from 36
                        const height = Math.min(maxHeight, 8 + dayCount * 6); // Increased base height and multiplier

                        return (
                          <div key={day} className="flex flex-col items-center">
                            <div className="w-full flex justify-center items-end h-40">
                              <div
                                className={`w-5/6 rounded-t-lg ${
                                  dayCount > 0
                                    ? "bg-gradient-to-t from-blue-600 to-blue-500"
                                    : "bg-slate-100"
                                }`}
                                style={{ height: `${height}px` }}
                              >
                                <span className="sr-only">
                                  {day}요일 {dayCount}회
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-slate-600 mt-2">
                              {day}
                            </span>
                            <span className="text-xs font-medium text-blue-600">
                              {dayCount > 0 ? `${dayCount}회` : "-"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      ※ 최근 {Math.min(patchLogs.length, 30)}개 패치 기준
                    </p>
                  </div>
                </div>

                {/* Recent Update Highlights Card */}
                <div className="relative h-full flex flex-col bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  {isLoaded && !isSignedIn && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FireIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">
                          주요 업데이트 하이라이트
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          로그인하고 핵심 업데이트를 놓치지 마세요
                        </p>
                        <SignInButton mode="modal">
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            로그인하기
                          </button>
                        </SignInButton>
                      </div>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      주요 업데이트 하이라이트
                    </h3>
                    <p className="text-slate-600 text-sm">
                      최근 패치에서 주목할 만한 주요 변경사항들을 확인해보세요.
                    </p>
                  </div>

                  <div className="flex-1 space-y-4">
                    {patchLogs.slice(0, 3).map((log, index) => {
                      const updateDate = new Date(log.published_at);
                      const isRecent =
                        new Date().getTime() - updateDate.getTime() <
                        7 * 24 * 60 * 60 * 1000;

                      return (
                        <Link
                          key={log.id}
                          href={`/patch/${log.id}`}
                          className="block bg-white p-4 rounded-lg border border-slate-100 hover:shadow-sm transition-all group hover:-translate-y-0.5 active:translate-y-0 hover:border-blue-200 active:border-blue-300"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-sm font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {log.title}
                                <span className="ml-2 inline-flex items-center">
                                  <svg
                                    className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </svg>
                                </span>
                              </h4>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-slate-500">
                                  {updateDate.toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    weekday: "short",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      ※ 최근 패치 중 상위 3개
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                맨 위로
              </button>
            </div>

            <div className="flex items-center justify-between mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                패치 노트
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
