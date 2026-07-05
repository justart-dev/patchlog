"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "patchlog-share-modal-dismissed";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function ShareModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < SEVEN_DAYS) {
        return;
      }
    }
    setIsOpen(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-6 shadow-2xl text-zinc-900">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
          aria-label="닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold mb-4 pr-6 text-zinc-900">
          라이벌 여러분,
          <br />
          Patchlog를 이용해주셔서 감사합니다.
        </h2>

        <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
          <p>
            지금까지 누적 <strong className="text-zinc-900">5,000뷰를 넘겼어요</strong>.
            작지만 의미 있는 성과입니다! 🎉
          </p>
          <p>
            Patchlog는 1인 개발자가 직접 운영 중입니다.
            사이트 운영에 소소한 비용이 발생하고 있어요.
          </p>
          <p>
            Patchlog가 유용하셨다면 주변 마블 라이벌즈
            플레이어들에게 한 번 소개해주세요.
            여러분의 공유가 서비스를 더 나아지게 만듭니다.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            7일간 보지 않기
          </button>
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
