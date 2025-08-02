"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TabNavigation from "../../components/TabNavigation";
import { addStylesToHtml } from "../../../app/utils/htmlUtils";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusDisplay from "../../components/StatusDisplay";
import CommentSection from "../../components/CommentSection";

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

export default function PatchDetailPage() {
  const params = useParams();
  const [patchDetail, setPatchDetail] = useState<PatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("ko");
  const router = useRouter();

  const languageTabs = [
    { label: "정보", value: "ko" },
    { label: "코멘트", value: "comment", disabled: true },
  ];

  useEffect(() => {
    const fetchPatchDetail = async () => {
      try {
        const response = await fetch(`/api/marvel-patch-logs/${params.id}`);
        if (!response.ok) {
          throw new Error("패치 정보를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setPatchDetail(data);
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
          {patchDetail.title}
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
            defaultActive="ko"
            onChange={(value) => {
              const selectedTab = languageTabs.find(
                (tab) => tab.value === value
              );
              if (selectedTab && !selectedTab.disabled) {
                setActiveLanguage(value);
              }
            }}
            // className="mb-8"
          />
          <div className="mt-14 max-w-none">
            {activeLanguage === "ko" && (
              <div
                dangerouslySetInnerHTML={{
                  __html: addStylesToHtml(patchDetail.translated_ko || ""),
                }}
              />
            )}
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

        {/* 댓글 섹션 */}
        <div id="comments" className="mt-16">
          <CommentSection patchLogId={patchDetail.id} />
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="뒤로 가기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">뒤로가기</span>
          </button>
        </div>
      </div>
    </section>
  );
}
