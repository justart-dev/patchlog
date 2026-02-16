"use client";

import { useRouter } from "next/navigation";
import { addStylesToHtml } from "../../utils/htmlUtils";
import {
  wrapSkillsWithUnderline,
  replaceEnglishTitles,
  convertYouTubePreviewTags,
} from "../../utils/textReplacer";
import { skillMap } from "../../utils/marvelGlossary";
import ErrorBoundary from "../../components/ErrorBoundary";
import dynamic from "next/dynamic";

const CommentSection = dynamic(
  () => import("../../components/CommentSection"),
  {
    loading: () => (
      <div className="animate-pulse h-32 bg-slate-100 dark:bg-gray-800 rounded-lg"></div>
    ),
    ssr: false,
  }
);

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
}: {
  patchDetail: PatchDetail;
  navigation: PatchNavigation;
}) {
  const router = useRouter();

  return (
    <section className="py-6 md:py-10">
      <div className="max-w-5xl mx-auto px-4">
        <header className="rounded-3xl bg-white dark:bg-gray-900 p-5 sm:p-6 md:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              {patchDetail.app_name}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              {new Date(patchDetail.published_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
            {replaceEnglishTitles(patchDetail.title)}
          </h1>
          <div className="mt-3 h-px bg-gray-200 dark:bg-gray-700" />
        </header>

        <article className="rounded-3xl bg-white dark:bg-gray-900 p-6 sm:p-8 md:p-10">
          <div className="max-w-none min-h-60 prose-lg">
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
                <div className="relative h-14 w-14 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 dark:border-t-white animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  제프가 열심히 번역중입니다.
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
                  곧 한글 패치 노트가 반영됩니다. 잠시만 기다려 주세요.
                </p>
              </div>
            )}
          </div>
        </article>

        <div className="mt-7 md:mt-8 pt-2">
          <div className="h-px bg-gray-200 dark:bg-gray-700 mb-5" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => router.push("/patch")}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              목록으로
            </button>
            <button
              onClick={() => window.open(patchDetail.url, "_blank")}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-black dark:hover:bg-gray-100 transition-colors"
            >
              원문 보러 가기
            </button>
          </div>
        </div>

        <section className="mt-7 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            {navigation.newer ? (
              <button
                onClick={() => router.push(`/patch/${navigation.newer!.id}`)}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-left hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">최신 업데이트</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {replaceEnglishTitles(navigation.newer.title)}
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">최신 업데이트</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">현재 페이지가 가장 최신입니다.</p>
              </div>
            )}
          </div>

          <div>
            {navigation.older ? (
              <button
                onClick={() => router.push(`/patch/${navigation.older!.id}`)}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-left hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">이전 업데이트</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {replaceEnglishTitles(navigation.older.title)}
                    </p>
                  </div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            ) : (
              <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">이전 업데이트</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">더 오래된 패치가 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        <section id="comments" className="mt-7 md:mt-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">댓글</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">패치 내용에 대한 의견을 남겨보세요.</p>
          </div>
          <ErrorBoundary
            fallback={
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="mb-4">댓글을 불러오는 중 문제가 발생했습니다.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
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
