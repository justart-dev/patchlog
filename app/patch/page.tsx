"use client";

import { useState, useEffect, useMemo } from "react";
import { PatchList, type PatchLog } from "../components/patchList";
import StatusDisplay from "../components/StatusDisplay";
import { useUser, SignInButton } from "@clerk/nextjs";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { formatDateKST, getKSTDayOfWeek } from "../utils/dateFormatter";


type LatestVideo = {
  title: string;
  videoId: string;
  videoUrl: string;
  publishedAt: string;
  embedUrl: string;
  thumbnailUrl: string;
  source: string;
};

export default function PatchPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [patchLogs, setPatchLogs] = useState<PatchLog[] | null>(null);
  const [latestVideo, setLatestVideo] = useState<LatestVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const fetchPatchLogs = async () => {
      try {
        const [patchResponse, latestVideoResponse] = await Promise.all([
          fetch("/api/marvel-patch-logs", {
            next: { revalidate: 1800 },
          }),
          fetch("/api/marvel-latest-video", {
            next: { revalidate: 1800 },
          }),
        ]);

        if (!patchResponse.ok) {
          throw new Error("패치 로그를 불러오는데 실패했습니다.");
        }

        const patchData = await patchResponse.json();
        setPatchLogs(patchData);

        if (latestVideoResponse.ok) {
          const latestVideoData = await latestVideoResponse.json();
          setLatestVideo(latestVideoData);
        }
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
      Math.max(...patchLogs.map((log) => new Date(log.published_at).getTime()))
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
      const day = getKSTDayOfWeek(log.published_at);
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
      <div className="relative overflow-x-clip bg-slate-50 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(circle_at_92%_12%,rgba(248,61,84,0.12),transparent_35%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_92%_12%,rgba(248,61,84,0.2),transparent_35%)]" />
        <div className="relative mx-auto w-full max-w-[1320px] animate-pulse space-y-8 px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-36">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 md:px-10">
            <div className="mb-5 h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mb-4 h-10 max-w-xl rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 max-w-2xl rounded bg-slate-200 dark:bg-slate-700" />
          </section>

          <section className="space-y-5">
            <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-7">
                <div className="mb-3 h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mb-6 h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(7)].map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className="h-20 w-4 rounded-t bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-4 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-7">
                <div className="mb-3 h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mb-6 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/85 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                      <div className="mb-2 h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-40 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/90"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-24 w-full border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 sm:h-auto sm:w-44 sm:border-b-0 sm:border-r" />
                    <div className="flex-1 space-y-3 p-5">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-6 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
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
    <div className="relative overflow-x-clip bg-slate-50 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(circle_at_92%_12%,rgba(248,61,84,0.12),transparent_35%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_92%_12%,rgba(248,61,84,0.2),transparent_35%)]" />

      <div className="relative mx-auto w-full max-w-[1320px] space-y-8 px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-36 md:space-y-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 md:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Patchlog Feed
          </p>
          <h1 className="mt-5 text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-3xl md:text-5xl">
            Marvel Rivals 패치노트
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base md:text-lg">
            최신 패치부터 상세 내역까지 빠르게 훑을 수 있도록 핵심 흐름 중심으로 정리합니다.
          </p>
        </section>

        {patchLogs ? (
          <>
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white md:text-3xl">패치 요약</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <article className="relative flex h-full flex-col rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-7">
                  {isLoaded && !isSignedIn ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/56 backdrop-blur-md dark:bg-slate-900/56">
                      <div className="px-6 text-center">
                        <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 dark:bg-white">
                          <ChartBarIcon className="h-5 w-5 text-white dark:text-slate-900" />
                        </div>
                        <p className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">업데이트 패턴 분석</p>
                        <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">로그인 후 상세 인사이트를 확인할 수 있습니다.</p>
                        <SignInButton mode="modal">
                          <button className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                            로그인
                          </button>
                        </SignInButton>
                      </div>
                    </div>
                  ) : null}

                  <h3 className="text-xl font-black text-slate-900 dark:text-white sm:text-xl">업데이트 패턴</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">최근 30개 기준으로 요일별 업데이트 빈도를 보여줍니다.</p>
                  <div className="mt-8 flex flex-1 items-center">
                    <div className="grid w-full grid-cols-7 gap-2">
                    {dayLabels.map((day, index) => {
                      const dayCount = updateStats.dayCounts[index] ?? 0;
                      const height = Math.min(68, 14 + dayCount * 9);
                      return (
                        <div key={day} className="flex flex-col items-center">
                          <div className="flex h-28 w-full items-end justify-center">
                            <div
                              className={`w-5 rounded-t-sm ${
                                dayCount > 0
                                  ? "bg-slate-900 dark:bg-white"
                                  : "bg-slate-200 dark:bg-slate-700"
                              }`}
                              style={{ height: `${height}px` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{day}</p>
                          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {dayCount > 0 ? `${dayCount}회` : "-"}
                          </p>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </article>

                <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-7">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white sm:text-xl">공식 영상 하이라이트</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Marvel Rivals 공식 채널에서 최신 주요 영상을 골라 보여줍니다.</p>

                  {latestVideo ? (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                      <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <iframe
                          className="h-full w-full"
                          src={`${latestVideo.embedUrl}?rel=0`}
                          title={latestVideo.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-slate-700 dark:bg-slate-800/60">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        최신 영상을 불러오는 중이거나 일시적으로 확인할 수 없습니다.
                      </p>
                    </div>
                  )}
                </article>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-900 dark:text-white md:text-3xl">패치 노트</h2>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:text-sm">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">최근 반영일</span>
                  <span className="ml-2 font-medium text-slate-500 dark:text-slate-400">
                    {formatDateKST(latestDate, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <PatchList patchLogs={patchLogs} />
            </section>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                맨 위로
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900/85">
            <h3 className="mb-2 text-xl font-black text-slate-900 dark:text-white">패치 내역을 수집 중입니다</h3>
            <p className="mx-auto max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              매일 자동으로 최신 패치노트를 확인해 업데이트합니다. 잠시 후 다시 확인해 주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
