import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  message = '로딩 중...',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center px-4 ${className}`}>
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 sm:p-7"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-11 w-11 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 dark:border-t-white animate-spin" />
          </div>

          <div className="flex-1 min-w-0">
            {message ? (
              <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                {message}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">잠시만 기다려 주세요</p>
          </div>
        </div>

      </div>
    </div>
  );
}
