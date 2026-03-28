'use client'

import { useTheme } from '@/lib/theme-provider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const baseButtonClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 dark:focus-visible:ring-slate-500'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/88 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/82">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <div className="h-4 w-4" />
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent">
          <div className="h-4 w-4" />
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent">
          <div className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/88 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/82"
      role="group"
      aria-label="테마 선택"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`${baseButtonClass} ${
          theme === 'light'
            ? 'rounded-full border-slate-300 bg-slate-100 text-slate-900 shadow-sm dark:border-slate-500 dark:bg-slate-800 dark:text-white'
            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white'
        }`}
        title="라이트 모드"
        aria-label="라이트 모드"
        aria-pressed={theme === 'light'}
      >
        <SunIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`${baseButtonClass} ${
          theme === 'dark'
            ? 'rounded-full border-slate-300 bg-slate-100 text-slate-900 shadow-sm dark:border-slate-500 dark:bg-slate-800 dark:text-white'
            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white'
        }`}
        title="다크 모드"
        aria-label="다크 모드"
        aria-pressed={theme === 'dark'}
      >
        <MoonIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`${baseButtonClass} ${
          theme === 'system'
            ? 'rounded-full border-slate-300 bg-slate-100 text-slate-900 shadow-sm dark:border-slate-500 dark:bg-slate-800 dark:text-white'
            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white'
        }`}
        title="시스템 설정"
        aria-label="시스템 설정 테마"
        aria-pressed={theme === 'system'}
      >
        <ComputerDesktopIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
