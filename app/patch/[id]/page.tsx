"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TabNavigation from "../../components/TabNavigation";
import { addStylesToHtml } from "../../../app/utils/htmlUtils";
import { wrapSkillsWithUnderline, replaceEnglishTitles, convertYouTubePreviewTags } from "../../../app/utils/textReplacer";
import { skillMap } from "../../../app/utils/marvelGlossary";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusDisplay from "../../components/StatusDisplay";
import dynamic from "next/dynamic";

const CommentSection = dynamic(
  () => import("../../components/CommentSection"),
  {
    loading: () => (
      <div className="animate-pulse h-32 bg-slate-100 rounded-lg"></div>
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
  // Add other properties that exist in your patch detail data
}

interface PatchNavigation {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export default function PatchDetailPage() {
  const params = useParams();
  const [patchDetail, setPatchDetail] = useState<PatchDetail | null>(null);
  const [patchNavigation, setPatchNavigation] = useState<PatchNavigation>({
    prev: null,
    next: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("patch");
  const router = useRouter();

  const languageTabs = [
    { label: "패치 노트", value: "patch" },
    { label: "프리미엄 요약", value: "premium", disabled: true },
  ];

  useEffect(() => {
    const fetchPatchDetail = async () => {
      try {
        // 패치 상세 정보 가져오기
        const detailResponse = await fetch(
          `/api/marvel-patch-logs/${params.id}`
        );
        if (!detailResponse.ok) {
          throw new Error("패치 정보를 불러오는데 실패했습니다.");
        }
        const detailData = await detailResponse.json();
        setPatchDetail(detailData);

        // 전체 패치 목록 가져와서 네비게이션 정보 구성
        const listResponse = await fetch("/api/marvel-patch-logs");
        if (listResponse.ok) {
          const patchList = await listResponse.json();
          const currentIndex = patchList.findIndex(
            (patch: any) => patch.id === params.id
          );

          if (currentIndex !== -1) {
            const prevPatch =
              currentIndex > 0 ? patchList[currentIndex - 1] : null;
            const nextPatch =
              currentIndex < patchList.length - 1
                ? patchList[currentIndex + 1]
                : null;

            setPatchNavigation({
              prev: prevPatch
                ? { id: prevPatch.id, title: prevPatch.title }
                : null,
              next: nextPatch
                ? { id: nextPatch.id, title: nextPatch.title }
                : null,
            });
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatchDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner
          message="패치 정보를 불러오는 중..."
          className="py-12"
        />
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

  if (!patchDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <StatusDisplay
          title="패치 정보를 찾을 수 없음"
          message="요청하신 패치 정보를 찾을 수 없습니다. 패치 목록에서 다시 확인해주세요."
          variant="warning"
          showHomeButton
          className="py-12"
        />
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
            {patchDetail.app_name}
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {replaceEnglishTitles(patchDetail.title)}
        </h1>
        <div className="text-gray-500 mb-8">
          {new Date(patchDetail.published_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div className="mt-8">
          <TabNavigation
            items={languageTabs}
            defaultActive="patch"
            onChange={(value) => {
              const selectedTab = languageTabs.find(
                (tab) => tab.value === value
              );
              if (selectedTab && !selectedTab.disabled) {
                setActiveTab(value);
              }
            }}
            // className="mb-8"
          />
          <div className="mt-14 max-w-none min-h-60 flex flex-col justify-center">
            {activeTab === "patch" && (
              <>
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-12">
                      🦈 제프가 열심히 번역 중입니다.
                    </h3>
                    <div className="mb-12">
                      <svg
                        className="w-16 h-16 text-blue-400 mx-auto animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>

                    <p className="text-gray-600 max-w-md leading-relaxed">
                      곧 한글 패치 노트로 만나보실 수 있어요!
                      <br />
                      잠시만 기다려주세요 ⚡
                    </p>
                  </div>
                )}
              </>
            )}
            {activeTab === "premium" && <div></div>}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => window.open(patchDetail.url, "_blank")}
            className="my-4 text-sm text-neutral-600 cursor-pointer hover:text-neutral-800 transition-colors"
          >
            [원문 보러 가기]
          </button>
        </div>

        {/* 패치 네비게이션 */}
        <div className="mt-16 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 이전 패치 */}
            <div className="w-full sm:w-1/2">
              {patchNavigation.prev ? (
                <button
                  onClick={() =>
                    router.push(`/patch/${patchNavigation.prev!.id}`)
                  }
                  className="group w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 bg-white h-20"
                >
                  <div className="flex items-center space-x-3 min-w-0 w-full">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 text-slate-600"
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
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs text-slate-500 font-medium mb-1">
                        이전 패치
                      </div>
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {replaceEnglishTitles(patchNavigation.prev.title)}
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full flex items-center p-4 rounded-xl border border-slate-200 bg-slate-50 h-20">
                  <div className="flex items-center space-x-3 min-w-0 w-full">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs text-slate-400 font-medium mb-1">
                        최신 패치노트
                      </div>
                      <div className="text-sm font-medium text-slate-500 truncate">
                        더 이상 새로운 패치가 없습니다
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 다음 패치 또는 마지막 노트 */}
            <div className="w-full sm:w-1/2">
              {patchNavigation.next ? (
                <button
                  onClick={() =>
                    router.push(`/patch/${patchNavigation.next!.id}`)
                  }
                  className="group w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 bg-white h-20"
                >
                  <div className="flex items-center space-x-3 min-w-0 w-full justify-end">
                    <div className="text-right min-w-0 flex-1">
                      <div className="text-xs text-slate-500 font-medium mb-1">
                        다음 패치
                      </div>
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {replaceEnglishTitles(patchNavigation.next.title)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 text-slate-600"
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
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full flex items-center p-4 rounded-xl border border-slate-200 bg-slate-50 h-20">
                  <div className="flex items-center space-x-3 min-w-0 w-full justify-end">
                    <div className="text-right min-w-0 flex-1">
                      <div className="text-xs text-slate-400 font-medium mb-1">
                        마지막 패치노트
                      </div>
                      <div className="text-sm font-medium text-slate-500 truncate">
                        더 이상 가져올 패치가 없습니다
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 디바이더 */}
        <div className="mt-8 mb-8">
          <div className="border-t border-slate-200"></div>
        </div>

        {/* 댓글 섹션 */}
        <div id="comments">
          <CommentSection patchLogId={patchDetail.id} />
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.push("/patch")}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="패치 목록으로 돌아가기"
          >
            <span className="font-medium">목록으로 돌아가기</span>
          </button>
        </div>
      </div>
    </section>
  );
}
