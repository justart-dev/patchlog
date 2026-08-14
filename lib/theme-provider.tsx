'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getStorageItem, setStorageItem } from './storage'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'patchlog-ui-theme',
  ...props
}: ThemeProviderProps) {
  // 클라이언트 첫 렌더에서 저장된 테마를 동기적으로 읽어 마운트 후 재렌더를 방지.
  // 서버에서는 defaultTheme으로 렌더되지만, 유일한 consumer(theme-toggle)가
  // mounted 가드로 감싸져 있어 hydration 불일치가 발생하지 않는다.
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = getStorageItem(storageKey) as Theme | null
    return storedTheme ?? defaultTheme
  })

  // 초기 클래스 적용은 layout.tsx <head>의 인라인 스크립트가 페인트 전에 처리하므로
  // 여기서는 사용자가 테마를 변경했을 때만 DOM을 갱신한다.
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setStorageItem(storageKey, newTheme)
    setThemeState(newTheme)
  }, [storageKey])

  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme, setTheme])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
