"use client";

import { useEffect, useMemo } from "react";
import { PatchList, type PatchLog } from "../components/patchList";
import StatusDisplay from "../components/StatusDisplay";
import { useUser, SignInButton } from "@clerk/nextjs";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { formatDateKST, getKSTDayOfWeek } from "../utils/dateFormatter";
import type { LatestVideo } from "@/lib/marvel-latest-video";

interface PatchPageClientProps {
  patchLogs: PatchLog[];
  latestVideo: LatestVideo | null;
  loadError?: string | null;
}

export default function PatchPageClient({
  patchLogs,
  latestVideo,
  loadError,
}: PatchPageClientProps) {
  const { isSignedIn, isLoaded } = useUser();
  const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
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

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <StatusDisplay
          title="오류 발생"
          message={loadError}
          variant="error"
          showHomeButton
          className="py-12"
        />
      </div>
    );
  }

  if (!patchLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <StatusDisplay
          title="오류 발생"
          message="패치 로그를 불러오지 못했습니다."
          variant="error"
          showHomeButton
          className="py-12"
        />
      </div>
    );
  }

  return (
    <div className="relative pb-20">
      <div className="relative mx-auto w-full max-w-[1200px] px-6 space-y-12">
        {/* Header Section */}
        <header className="animate-hero-enter">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-6">
            MARVEL RIVALS<br />
            <span className="text-archive-zinc-400">PATCH ARCHIVE</span>
          </h1>
          <p className="max-w-2xl text-archive-zinc-600 dark:text-archive-zinc-400 text-sm sm:text-base leading-relaxed">
            마블 라이벌즈의 모든 밸런스 패치와 시스템 업데이트를 정밀 추적합니다.<br />
            핵심 수치 변화를 중심으로 아카이빙된 기록을 확인하세요.
          </p>
        </header>

        {patchLogs.length > 0 ? (
          <>
            {/* Stats & Video Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-hero-enter [animation-delay:100ms]">
              {/* Pattern Analysis */}
              <article className="glass-card p-8 relative flex flex-col justify-between overflow-hidden">
                {isLoaded && !isSignedIn && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-archive-zinc-50/95 dark:bg-archive-zinc-950/95 backdrop-blur-[12px]">
                    <div className="text-center p-6">
                      <p className="text-[10px] font-black tracking-widest uppercase mb-2 opacity-50">Data Encrypted</p>
                      <p className="text-[11px] font-bold text-archive-zinc-600 dark:text-archive-zinc-400 mb-5">상세 분석 데이터 열람을 위해 로그인이 필요합니다.</p>
                      <SignInButton mode="modal">
                        <button className="px-6 py-2.5 bg-hero-red-500 hover:bg-hero-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full hover:scale-105 transition-transform shadow-lg shadow-hero-red-500/20">
                          Login to Access
                        </button>
                      </SignInButton>
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <p className="text-[10px] font-black tracking-widest text-hero-blue-500 mb-2 uppercase">Pattern Analysis</p>
                  <h3 className="text-xl font-black tracking-tight">업데이트 주기 분석</h3>
                </div>

                <div className="flex items-end justify-between h-32 gap-2 mb-4">
                  {dayLabels.map((day, index) => {
                    const dayCount = updateStats.dayCounts[index] ?? 0;
                    const height = Math.max(15, (dayCount / (updateStats.topDayCount || 1)) * 100);
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center group">
                        <div className="w-full bg-archive-zinc-100 dark:bg-archive-zinc-900 rounded-t-sm relative flex items-end justify-center overflow-hidden h-24">
                          <div 
                            className="w-full bg-archive-zinc-950 dark:bg-white transition-all duration-700 ease-out origin-bottom"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="mt-3 text-[10px] font-black text-archive-zinc-400">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] font-bold text-archive-zinc-500 uppercase tracking-tighter">
                  Based on last {updateStats.recentCount} segments
                </p>
              </article>

              {/* Video Highlight */}
              <article className="glass-card p-8 flex flex-col justify-between">
                <div className="mb-6">
                  <p className="text-[10px] font-black tracking-widest text-hero-red-500 mb-2 uppercase">Visual Intel</p>
                  <h3 className="text-xl font-black tracking-tight">공식 하이라이트</h3>
                </div>

                {latestVideo ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-2xl">
                    <iframe
                      className="h-full w-full"
                      src={`${latestVideo.embedUrl}?rel=0`}
                      title={latestVideo.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center bg-archive-zinc-100 dark:bg-archive-zinc-900 rounded-xl">
                    <span className="text-[10px] font-black text-archive-zinc-400 tracking-widest uppercase">Video Signal Lost</span>
                  </div>
                )}
              </article>
            </div>

            {/* Patch List Section */}
            <section className="space-y-8 animate-hero-enter [animation-delay:200ms]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-archive-zinc-200 dark:border-archive-zinc-800 pb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase">패치 로그 아카이브</h2>
                  <p className="text-xs font-bold text-archive-zinc-500 mt-1 uppercase tracking-widest">밸런스 변경점부터 업데이트 내역까지 모두 기록합니다</p>
                </div>
                <div className="px-4 py-2 glass rounded-full flex items-center gap-3">
                  <span className="text-[10px] font-black text-archive-zinc-400 uppercase tracking-widest">마지막 업데이트</span>
                  <span className="text-xs font-black tracking-tight">
                    {formatDateKST(latestDate, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <PatchList patchLogs={patchLogs} />

              <div className="flex justify-center pt-10">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="px-8 py-3 glass rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Return to Top
                </button>
              </div>
            </section>
          </>
        ) : (
          <div className="glass-card py-24 text-center">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">No Records Found</h2>
            <p className="max-w-md mx-auto text-archive-zinc-500 text-sm leading-relaxed">
              데이터베이스에 저장된 기록이 없습니다. 시스템이 현재 Steam 데이터를 크롤링 중일 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
