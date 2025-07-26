import React from "react";
import Link from "next/link";

interface StatusDisplayProps {
  /** Main title of the error message */
  title?: string;
  /** Detailed error message */
  message: string;
  /** Whether to show the home button */
  showHomeButton?: boolean;
  /** Custom home button URL (default: '/patch') */
  homePath?: string;
  /** Custom home button text */
  homeButtonText?: string;
  /** Whether to show the retry button */
  showRetryButton?: boolean;
  /** Callback when retry button is clicked */
  onRetry?: () => void;
  /** Custom retry button text */
  retryButtonText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom icon (React node) */
  icon?: React.ReactNode;
  /** Status type of the display */
  variant?: 'error' | 'warning' | 'info' | 'confirm';
}

const variantStyles = {
  error: {
    bg: 'bg-red-50',
    icon: (
      <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-amber-50',
    icon: (
      <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-50',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  confirm: {
    bg: 'bg-green-50',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

export default function StatusDisplay({
  title = "오류 발생",
  message,
  showHomeButton = true,
  homePath = "/patch",
  homeButtonText = "목록으로 돌아가기",
  showRetryButton = false,
  onRetry,
  retryButtonText = "다시 시도",
  className = "",
  icon,
  variant = "error",
}: StatusDisplayProps) {
  const variantStyle = variantStyles[variant] || variantStyles.error;
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 ${className}`}
    >
      <div className={`${variantStyle.bg} p-4 rounded-full mb-6`}>
        {icon || variantStyle.icon}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-600 text-center mb-6 max-w-md">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {showHomeButton && (
          <Link
            href={homePath}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            {homeButtonText}
          </Link>
        )}

        {showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {retryButtonText}
          </button>
        )}
      </div>
    </div>
  );
}
