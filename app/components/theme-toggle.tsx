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
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <div className="p-2 rounded-md bg-white dark:bg-gray-700 shadow-sm">
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
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="라이트 모드"
      >
        <SunIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="다크 모드"
      >
        <MoonIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="시스템 설정"
      >
        <ComputerDesktopIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  )
}