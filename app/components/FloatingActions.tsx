"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackForm from "./FeedbackForm";

const FAN_DISTANCE = 64;

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleBack = () => {
    setOpen(false);
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const itemClass = (visible: boolean, delay: string) =>
    `absolute bottom-0 right-0 inline-flex items-center gap-2.5 whitespace-nowrap rounded-sm border border-archive-zinc-200 bg-white/95 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-archive-zinc-600 shadow-sm backdrop-blur transition-all duration-200 ease-out hover:border-archive-zinc-400 hover:text-archive-zinc-950 dark:border-archive-zinc-800 dark:bg-archive-zinc-950/95 dark:text-archive-zinc-400 dark:hover:border-archive-zinc-600 dark:hover:text-white ${
      visible
        ? `opacity-100 ${delay}`
        : "pointer-events-none scale-90 opacity-0"
    }`;

  return (
    <>
      <div ref={containerRef} className="fixed bottom-[18px] right-[18px] z-[90] sm:bottom-6 sm:right-6">
        <div className="relative h-11 w-11">
        {/* 왼쪽: 뒤로가기 (먼저 등장) */}
        <button
          type="button"
          onClick={handleBack}
          className={itemClass(open, "delay-0")}
          style={{
            transform: open ? `translate(-${FAN_DISTANCE}px, 0)` : "translate(0, 0)",
          }}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          <span>뒤로</span>
        </button>

        {/* 위쪽: 피드백 (이어서 등장) */}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setFeedbackOpen(true);
          }}
          className={itemClass(open, "delay-75")}
          style={{
            transform: open ? `translate(0, -${FAN_DISTANCE}px)` : "translate(0, 0)",
          }}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </svg>
          <span>피드백</span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? "빠른 메뉴 닫기" : "빠른 메뉴 열기"}
          className="absolute bottom-0 right-0 inline-flex h-11 w-11 items-center justify-center rounded-sm bg-archive-zinc-950 text-white shadow-lg transition-colors hover:bg-hero-red-500 dark:bg-white dark:text-archive-zinc-950 dark:hover:bg-hero-red-500 dark:hover:text-white"
        >
          <span className="relative block h-[18px] w-[18px]">
            <svg
              className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-200 ${
                open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <svg
              className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-200 ${
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </span>
        </button>
        </div>
      </div>

      <FeedbackForm open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
