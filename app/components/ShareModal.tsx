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
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      const scrollStyle = getComputedStyle(document.documentElement).overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = scrollStyle;
      };
    }
  }, [isOpen]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-sm bg-white dark:bg-archive-zinc-950 border border-archive-zinc-200 dark:border-archive-zinc-800 p-6 shadow-2xl text-archive-zinc-900 dark:text-white animate-hero-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-archive-zinc-400 hover:text-archive-zinc-950 dark:hover:text-white transition-colors"
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

        <h2 className="text-lg font-semibold mb-4 pr-6">
          라이벌 여러분,
          <br />
          Patchlog를 이용해주셔서 감사합니다.
        </h2>

        <div className="space-y-3 text-sm text-archive-zinc-600 dark:text-archive-zinc-400 leading-relaxed">
          <p>
            지금까지 누적 <strong className="text-archive-zinc-950 dark:text-white">5,000뷰를 넘겼어요</strong>.
            작지만 의미 있는 성과입니다! 🎉
          </p>
          <p>
            패치로그는 1인 개발자가 직접 만들고 운영하는 작은 프로젝트입니다. 유지에는 조금씩 비용도 들고, 최근에는 한국어 유저가 줄어드는 것 같아 계속 운영할 수 있을지 고민이 되기도 합니다.
          </p>
          <p>
            그래도 찾아와 주시는 분들이 있는 한 조금 더 만들어 보고 싶습니다. 유용하게 사용하셨다면 주변의 마블 라이벌즈 플레이어들에게도 소개해 주세요.
          </p>
          <p>작은 공유 하나하나가 서비스를 계속 만들어 나가는 큰 힘이 됩니다.</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {/* <a
            href="https://ctee.kr/place/justart"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="rounded-sm bg-archive-zinc-950 dark:bg-white px-4 py-2.5 text-center text-sm font-medium text-white dark:text-archive-zinc-950 transition-colors"
          >
            ☕ 크티에서 후원하기
          </a> */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 rounded-sm border border-archive-zinc-300 dark:border-archive-zinc-700 px-4 py-2.5 text-sm font-medium text-archive-zinc-700 dark:text-archive-zinc-300 hover:border-archive-zinc-400 dark:hover:border-archive-zinc-600 hover:text-archive-zinc-950 dark:hover:text-white transition-colors"
            >
              7일간 보지 않기
            </button>
            <button
              onClick={handleClose}
              className="flex-1 rounded-sm bg-archive-zinc-950 dark:bg-white px-4 py-2.5 text-sm font-medium text-white dark:text-archive-zinc-950 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
