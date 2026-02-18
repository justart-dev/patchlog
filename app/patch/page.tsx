"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PatchList, type PatchLog } from "../components/patchList";
import StatusDisplay from "../components/StatusDisplay";
import { useUser, SignInButton } from "@clerk/nextjs";
import { ChartBarIcon, FireIcon } from "@heroicons/react/24/outline";
import { replaceEnglishTitles } from "../utils/textReplacer";

export default function PatchPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [patchLogs, setPatchLogs] = useState<PatchLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

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

  const latestDate = useMemo(() => {
    if (!patchLogs || patchLogs.length === 0) return new Date();

    return new Date(
      Math.max(
        ...patchLogs.map((log) => new Date(log.published_at).getTime())
      )
    );
  }, [patchLogs]);

  const updateStats = useMemo(() => {
    if (!patchLogs || patchLogs.length === 0) {
      return {
        totalCount: 0,
        recentCount: 0,
        dayCounts: Array(7).fill(0),
        topDayLabel: "-",
        topDayCount: 0,
      };
    }

    const recentLogs = patchLogs.slice(0, 30);
    const dayCounts = Array(7).fill(0);

    for (const log of recentLogs) {
      const day = new Date(log.published_at).getDay();
      dayCounts[day] += 1;
    }

    let topDayIndex = 0;
    for (let i = 1; i < dayCounts.length; i += 1) {
      if (dayCounts[i] > dayCounts[topDayIndex]) topDayIndex = i;
    }

    return {
      totalCount: patchLogs.length,
      recentCount: recentLogs.length,
      dayCounts,
      topDayLabel: dayLabels[topDayIndex],
      topDayCount: dayCounts[topDayIndex],
    };
  }, [patchLogs]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 md:space-y-12 animate-pulse">
        <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 sm:px-8 md:px-10 py-10 text-center">
          <div className="h-6 w-32 mx-auto rounded bg-gray-200 dark:bg-gray-700 mb-5" />
          <div className="h-11 max-w-xl mx-auto rounded bg-gray-200 dark:bg-gray-700 mb-4" />
          <div className="h-5 max-w-2xl mx-auto rounded bg-gray-200 dark:bg-gray-700" />
        </section>

        <section className="space-y-5">
          <div className="h-8 w-44 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 p-5 sm:p-6 space-y-3">
              <div className="h-5 w-36 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-700/60" />
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 p-5 sm:p-6 space-y-3">
              <div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-700/60" />
                <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-700/60" />
                <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-700/60" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-7 w-44 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <article
                key={index}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
              >
                <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </article>
            ))}
          </div>
        </section>
      </div>
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10 md:space-y-12">
      <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 sm:px-8 md:px-10 py-10 text-center">
        <p className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-5">
          Patchlog Feed
        </p>
        <h1 className="text-[1.75rem] md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
          Marvel Rivals 패치노트
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          패치 내역은 UTC 기준 09:00에 적용되며, 한국 시간으로는 오후 6시쯤에 업데이트됩니다.
        </p>
      </section>

      {patchLogs ? (
        <>
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">패치 요약</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <article className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 p-5 sm:p-6">
                {isLoaded && !isSignedIn ? (
                  <div className="absolute inset-0 z-10 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                        <ChartBarIcon className="w-5 h-5 text-white dark:text-gray-900" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">업데이트 패턴 분석</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">로그인 후 상세 인사이트를 확인할 수 있습니다.</p>
                      <SignInButton mode="modal">
                        <button className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold">
                          로그인
                        </button>
                      </SignInButton>
                    </div>
                  </div>
                ) : null}

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">업데이트 패턴</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">요일별 업데이트 빈도를 빠르게 확인할 수 있습니다.</p>
                <div className="grid grid-cols-7 gap-2">
                  {dayLabels.map((day, index) => {
                    const dayCount = updateStats.dayCounts[index] ?? 0;
                    const height = Math.min(56, 10 + dayCount * 8);
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <div className="h-24 w-full flex items-end justify-center">
                          <div
                            className={`w-4 rounded-t-sm ${dayCount > 0 ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"}`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{day}</p>
                        <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{dayCount > 0 ? `${dayCount}회` : "-"}</p>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 p-5 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">먼저 읽어볼 패치</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">가장 최근에 업데이트된 소식이에요</p>
                <div className="space-y-3">
                  {patchLogs.slice(0, 3).map((log, index) => (
                    <Link
                      key={log.id}
                      href={`/patch/${log.id}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/60 px-3 py-3 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{replaceEnglishTitles(log.title)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.published_at).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">패치 노트</h2>
              <p className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                마지막 업데이트: {latestDate.toLocaleDateString("ko-KR")}
              </p>
            </div>
            <PatchList patchLogs={patchLogs} />
          </section>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              맨 위로
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-14 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">패치 내역을 수집 중입니다</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            매일 자동으로 최신 패치노트를 확인해 업데이트합니다. 잠시 후 다시 확인해 주세요.
          </p>
        </div>
      )}
    </div>
  );
}
