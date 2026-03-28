"use client";

import { useRouter } from "next/navigation";
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
    <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <section className="relative overflow-x-clip bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(circle_at_88%_18%,rgba(248,61,84,0.12),transparent_36%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_88%_18%,rgba(248,61,84,0.2),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-36">
        <header className="rounded-3xl border border-slate-300 bg-white/92 p-6 shadow-sm dark:border-slate-600 dark:bg-slate-900/85 sm:p-7 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              {formatDateKST(patchDetail.published_at, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {replaceEnglishTitles(patchDetail.title)}
          </h1>
        </header>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172ad9] sm:p-8 md:p-10">
          <div className="patch-content min-h-60 max-w-none prose-lg dark:p-0">
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
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6 h-14 w-14">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-slate-900 dark:border-t-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                  제프가 열심히 번역중입니다.
                </h3>
                <p className="max-w-md text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                  곧 한글 패치 노트가 반영됩니다. 잠시만 기다려 주세요.
                </p>
              </div>
            )}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => router.push("/patch")}
              className="inline-flex items-center rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
            >
              목록으로 돌아가기
            </button>
            <button
              onClick={() => window.open(patchDetail.url, "_blank")}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-black dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              <span>원문 보기</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5h5m0 0v5m0-5L10 14"
                />
              </svg>
            </button>
          </div>
        </article>

        <section className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            {navigation.newer ? (
              <button
                onClick={() => router.push(`/patch/${navigation.newer!.id}`)}
                className="w-full rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/85 dark:hover:border-slate-500"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">최신 업데이트</p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {replaceEnglishTitles(navigation.newer.title)}
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">최신 업데이트</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">현재 페이지가 가장 최신입니다.</p>
              </div>
            )}
          </div>

          <div>
            {navigation.older ? (
              <button
                onClick={() => router.push(`/patch/${navigation.older!.id}`)}
                className="w-full rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/85 dark:hover:border-slate-500"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">이전 업데이트</p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {replaceEnglishTitles(navigation.older.title)}
                    </p>
                  </div>
                  <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </button>
            ) : (
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">이전 업데이트</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">더 오래된 패치가 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        <section
          id="comments"
          className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-6"
        >
          <ErrorBoundary
            fallback={
              <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                <p className="mb-4">댓글을 불러오는 중 문제가 발생했습니다.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  새로고침
                </button>
              </div>
            }
          >
            <CommentSection patchLogId={patchDetail.id} />
          </ErrorBoundary>
        </section>
      </div>
    </section>
  );
}
