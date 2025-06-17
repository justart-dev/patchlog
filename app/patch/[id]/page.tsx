"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TabNavigation from "../../components/TabNavigation";

interface PatchDetail {
  id: string;
  title: string;
  content: string;
  translateKo: string;
  publishedAt: string;
  appName: string;
  appGid: string;
}

export default function PatchDetailPage() {
  const params = useParams();
  const [patchDetail, setPatchDetail] = useState<PatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"ko" | "en">("ko");
  const router = useRouter();

  const languageTabs = [
    { label: "한국어", value: "ko" },
    { label: "영어", value: "en" },
  ];

  useEffect(() => {
    const fetchPatchDetail = async () => {
      try {
        const response = await fetch(`/api/steam-patch-logs/${params.id}`);
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
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!patchDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        패치 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
            {patchDetail.appName}
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {patchDetail.title}
        </h1>
        <div className="text-gray-500 mb-8">
          {new Date(patchDetail.publishedAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div className="mt-8">
          <TabNavigation
            items={languageTabs}
            defaultActive="ko"
            onChange={(value) => setActiveLanguage(value as "ko" | "en")}
            className="mb-8"
          />

          <div className="prose max-w-none">
            {activeLanguage === "ko" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: patchDetail.translateKo || "",
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: patchDetail.content || "" }}
              />
            )}
          </div>
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
