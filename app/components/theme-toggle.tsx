'use client'

import { useTheme } from '@/lib/theme-provider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 서버사이드에서는 기본 상태로 렌더링
    return (
      <div className="flex items-center space-x-1 rounded-lg p-0.5">
        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="h-4 w-4" />
        </div>
        <div className="p-2 rounded-md">
          <div className="h-4 w-4" />
        </div>
        <div className="p-2 rounded-md">
          <div className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1 rounded-lg p-0.5" role="group" aria-label="테마 선택">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md ${
          theme === 'light'
            ? 'bg-gray-100 dark:bg-gray-800'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 dark:focus-visible:ring-slate-500`}
        title="라이트 모드"
        aria-label="라이트 모드"
        aria-pressed={theme === 'light'}
      >
        <SunIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md ${
          theme === 'dark'
            ? 'bg-gray-100 dark:bg-gray-800'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 dark:focus-visible:ring-slate-500`}
        title="다크 모드"
        aria-label="다크 모드"
        aria-pressed={theme === 'dark'}
      >
        <MoonIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md ${
          theme === 'system'
            ? 'bg-gray-100 dark:bg-gray-800'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 dark:focus-visible:ring-slate-500`}
        title="시스템 설정"
        aria-label="시스템 설정 테마"
        aria-pressed={theme === 'system'}
      >
        <ComputerDesktopIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  )
}
