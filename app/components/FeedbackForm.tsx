"use client";

import { useEffect, useRef, useState } from "react";

const TYPES = ["버그", "제안", "기타"] as const;
type FeedbackType = (typeof TYPES)[number];

const MAX_MESSAGE = 1000;

export default function FeedbackForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState<FeedbackType>("버그");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => textareaRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      clearTimeout(timer);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setStatus("idle");
    setError(null);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError("내용을 5자 이상 적어주세요.");
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: trimmed,
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "전송에 실패했습니다.");
      }

      setStatus("done");
      setMessage("");
      setEmail("");
    } catch (submitError) {
      setStatus("idle");
      setError(submitError instanceof Error ? submitError.message : "전송에 실패했습니다.");
    }
  };

  const inputClass =
    "w-full rounded-sm border border-archive-zinc-200 bg-white px-3 py-2.5 text-sm text-archive-zinc-900 placeholder:text-archive-zinc-400 focus:border-archive-zinc-400 focus:outline-none dark:border-archive-zinc-800 dark:bg-archive-zinc-950 dark:text-white dark:placeholder:text-archive-zinc-500 dark:focus:border-archive-zinc-600";
  const labelClass =
    "mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-archive-zinc-400";

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full rounded-sm border border-archive-zinc-200 bg-white shadow-2xl animate-hero-enter dark:border-archive-zinc-800 dark:bg-archive-zinc-950 ${
          status === "done" ? "max-w-[360px] p-6" : "max-w-md p-6"
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 text-archive-zinc-400 transition-colors hover:text-archive-zinc-950 dark:hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="text-center">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-hero-red-500">
              Sent
            </p>
            <h2 className="mb-2 text-lg font-black tracking-tight text-archive-zinc-950 dark:text-white">
              잘 받았습니다
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-archive-zinc-500 dark:text-archive-zinc-400">
              의견 남겨주셔서 감사합니다. 참고해서 살펴보겠습니다.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-sm bg-archive-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-hero-red-500 dark:bg-white dark:text-archive-zinc-950 dark:hover:bg-hero-red-500 dark:hover:text-white"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2
              id="feedback-title"
              className="mb-1 text-lg font-black tracking-tight text-archive-zinc-950 dark:text-white"
            >
              피드백 보내기
            </h2>
            <p className="mb-6 text-xs leading-relaxed text-archive-zinc-500 dark:text-archive-zinc-400">
              불편한 점이나 개선사항을 알려주시면 반영하겠습니다.
            </p>

            <div className="mb-5">
              <span className={labelClass}>유형</span>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((option) => {
                  const isActive = type === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setType(option)}
                      aria-pressed={isActive}
                      className={`rounded-sm px-3 py-1.5 text-[11px] font-bold tracking-tight transition-colors ${
                        isActive
                          ? "bg-archive-zinc-950 text-white dark:bg-white dark:text-archive-zinc-950"
                          : "bg-white text-archive-zinc-500 ring-1 ring-archive-zinc-200 hover:text-archive-zinc-950 dark:bg-archive-zinc-950 dark:text-archive-zinc-400 dark:ring-archive-zinc-800 dark:hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClass} htmlFor="feedback-message">
                내용
              </label>
              <textarea
                id="feedback-message"
                ref={textareaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                maxLength={MAX_MESSAGE}
                placeholder="불편했던 점이나 개선 아이디어를 편하게 적어주세요."
                className={`${inputClass} resize-none leading-relaxed`}
              />
              <p className="mt-1 text-right font-mono text-[10px] text-archive-zinc-400">
                {message.length} / {MAX_MESSAGE}
              </p>
            </div>

            <div className="mb-5">
              <label className={labelClass} htmlFor="feedback-email">
                이메일 (선택)
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="답변받을 이메일"
                className={inputClass}
              />
            </div>

            {error ? (
              <p className="mb-4 text-xs font-medium text-hero-red-500">{error}</p>
            ) : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-sm border border-archive-zinc-300 px-4 py-2.5 text-sm font-medium text-archive-zinc-700 transition-colors hover:border-archive-zinc-400 hover:text-archive-zinc-950 dark:border-archive-zinc-700 dark:text-archive-zinc-300 dark:hover:border-archive-zinc-600 dark:hover:text-white"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex-1 rounded-sm bg-archive-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-hero-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-archive-zinc-950 dark:hover:bg-hero-red-500 dark:hover:text-white"
              >
                {status === "sending" ? "보내는 중…" : "보내기"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
