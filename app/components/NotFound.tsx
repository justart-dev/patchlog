import React from "react";

interface NotFoundProps {
  message?: string;
  className?: string;
}

export default function NotFound({
  message = "요청하신 정보를 찾을 수 없습니다.",
  className = "",
}: NotFoundProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">알림</h3>
      <p className="text-slate-600 text-center max-w-md">{message}</p>
      <a
        href="/patch"
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        목록으로 돌아가기
      </a>
    </div>
  );
}
