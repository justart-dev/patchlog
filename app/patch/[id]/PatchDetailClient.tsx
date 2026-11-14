"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { addStylesToHtml } from "../../utils/htmlUtils";
import {
  wrapSkillsWithUnderline,
  replaceEnglishTitles,
  convertYouTubePreviewTags,
} from "../../utils/textReplacer";
import ErrorBoundary from "../../components/ErrorBoundary";
import dynamic from "next/dynamic";
import { formatDateKST } from "../../utils/dateFormatter";

const CommentSection = dynamic(() => import("../../components/CommentSection"), {
  loading: () => (
    <div className="h-32 animate-pulse rounded-sm bg-archive-zinc-100 dark:bg-archive-zinc-800" />
  ),
  ssr: false,
});

interface PatchDetail {
  id: string;
  app_name: string;
  title: string;
  url: string;
  published_at: string;
  translated_ko: string;
  content: string;
}

interface PatchNavigation {
  newer: { id: string; title: string } | null;
  older: { id: string; title: string } | null;
}

export default function PatchDetailClient({
  patchDetail,
  navigation,
  skillMap,
}: {
  patchDetail: PatchDetail;
  navigation: PatchNavigation;
  skillMap: Record<string, string>;
}) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="pb-20">
      <div className="relative mx-auto w-full max-w-[900px] px-6">
        <header className="mb-10 animate-hero-enter">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-[1.05] text-archive-zinc-950 dark:text-white mb-6">
            {replaceEnglishTitles(patchDetail.title)}
          </h1>

          <div className="flex items-center gap-4 font-mono text-xs text-archive-zinc-400">
            <span className="uppercase tracking-widest">Recorded on</span>
            <span className="h-px w-8 bg-archive-zinc-200 dark:bg-archive-zinc-800" />
            <time>
              {formatDateKST(patchDetail.published_at, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        <article className="border-t border-b border-archive-zinc-200 dark:border-archive-zinc-800 py-8 sm:py-12 mb-10 animate-hero-enter [animation-delay:100ms]">
          <div className="patch-content prose prose-zinc dark:prose-invert max-w-none prose-h1:text-2xl prose-h1:font-black prose-h2:text-xl prose-h2:font-black prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-hero-red-500 dark:prose-strong:text-hero-red-400">
            {patchDetail.translated_ko ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: wrapSkillsWithUnderline(
                    convertYouTubePreviewTags(
                      addStylesToHtml(patchDetail.translated_ko)
                    ),
                    skillMap
                  ),
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-8 h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-archive-zinc-100 dark:border-archive-zinc-800" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-hero-red-500" />
                </div>
                <h3 className="text-xl font-black mb-2">ARCHIVE IN PROGRESS</h3>
                <p className="max-w-xs mx-auto text-sm text-archive-zinc-500 leading-relaxed">
                  데이터베이스 동기화가 진행 중입니다. 잠시만 기다려 주십시오.
                </p>
              </div>
            )}
          </div>

          <div className="mt-20 pt-10 border-t border-archive-zinc-200 dark:border-archive-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/patch"
              prefetch={false}
              className="group flex items-center gap-2 text-xs font-black tracking-widest uppercase text-archive-zinc-500 hover:text-archive-zinc-950 dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              <span>RETURN TO DIRECTORY</span>
            </Link>
            <button
              onClick={() => window.open(patchDetail.url, "_blank")}
              className="px-6 py-3 bg-archive-zinc-950 dark:bg-white text-white dark:text-archive-zinc-950 text-xs font-black tracking-widest uppercase rounded-sm transition-colors"
            >
              VIEW RAW DATA SOURCE
            </button>
          </div>
        </article>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-10 border border-archive-zinc-200 dark:border-archive-zinc-800 bg-archive-zinc-200 dark:bg-archive-zinc-800 animate-hero-enter [animation-delay:200ms]">
          {navigation.newer ? (
            <button
              onClick={() => router.push(`/patch/${navigation.newer!.id}`)}
              className="group bg-white dark:bg-archive-zinc-950 p-5 text-left transition-colors hover:bg-archive-zinc-100/70 dark:hover:bg-archive-zinc-900/60"
            >
              <p className="text-[10px] font-mono font-bold text-archive-zinc-400 mb-2 uppercase tracking-widest">Next record</p>
              <p className="font-bold text-sm tracking-tight truncate group-hover:text-hero-red-500 transition-colors">
                {replaceEnglishTitles(navigation.newer.title)}
              </p>
            </button>
          ) : (
            <div className="bg-white dark:bg-archive-zinc-950 p-5 opacity-50">
              <p className="text-[10px] font-mono font-bold text-archive-zinc-400 mb-2 uppercase tracking-widest">Latest record</p>
              <p className="font-bold text-sm tracking-tight">No newer updates available.</p>
            </div>
          )}

          {navigation.older ? (
            <button
              onClick={() => router.push(`/patch/${navigation.older!.id}`)}
              className="group bg-white dark:bg-archive-zinc-950 p-5 text-left transition-colors hover:bg-archive-zinc-100/70 dark:hover:bg-archive-zinc-900/60"
            >
              <p className="text-[10px] font-mono font-bold text-archive-zinc-400 mb-2 uppercase tracking-widest">Previous record</p>
              <p className="font-bold text-sm tracking-tight truncate group-hover:text-hero-red-500 transition-colors">
                {replaceEnglishTitles(navigation.older.title)}
              </p>
            </button>
          ) : (
            <div className="bg-white dark:bg-archive-zinc-950 p-5 opacity-50">
              <p className="text-[10px] font-mono font-bold text-archive-zinc-400 mb-2 uppercase tracking-widest">Oldest record</p>
              <p className="font-bold text-sm tracking-tight">No older updates available.</p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <section id="comments" className="border-t border-b border-archive-zinc-200 dark:border-archive-zinc-800 py-8 animate-hero-enter [animation-delay:300ms]">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-2 w-2 rounded-full bg-hero-red-500" />
            <h3 className="text-lg font-black tracking-tighter uppercase">ARCHIVE DISCUSSION</h3>
          </div>
          <ErrorBoundary
            fallback={
              <div className="py-12 text-center text-archive-zinc-500">
                <p className="mb-6 font-bold uppercase tracking-widest text-xs">Synchronization Error</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 glass rounded-sm text-xs font-black uppercase tracking-widest hover:bg-archive-zinc-100 transition-colors"
                >
                  RETRY SYNC
                </button>
              </div>
            }
          >
            <CommentSection patchLogId={patchDetail.id} />
          </ErrorBoundary>
        </section>
      </div>
    </div>
  );
}
