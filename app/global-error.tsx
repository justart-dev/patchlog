'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 글로벌 에러 로깅
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <head>
        <title>오류 발생 - PatchLog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-red-500 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              심각한 오류가 발생했습니다
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              애플리케이션에 예상치 못한 문제가 발생했습니다.
              <br />
              잠시 후 다시 시도하거나 홈으로 이동해주세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              
              <a
                href="/"
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                홈으로 이동
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left bg-white rounded-lg p-4 border">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  개발자 정보 보기
                </summary>
                <pre className="mt-4 p-4 bg-red-50 rounded text-xs text-red-700 overflow-auto border-l-4 border-red-500">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\n'}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                문제가 지속될 경우{' '}
                <a 
                  href="mailto:support@patchlog.com" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  고객지원
                </a>
                으로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}