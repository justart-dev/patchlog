'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
  // SSR/CSR 초기 렌더를 동일하게 맞추기 위해 기본 테마로 시작
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // 마운트 후 저장된 테마를 복원
  useEffect(() => {
    const storedTheme = getStorageItem(storageKey) as Theme | null
    if (storedTheme && storedTheme !== theme) {
      setThemeState(storedTheme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    // 부드러운 전환을 위한 transition 클래스 추가
    root.classList.add('transition-colors', 'duration-300', 'ease-in-out')
    root.style.transition = 'background-color 0.3s ease-in-out, color 0.3s ease-in-out'

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

  const setTheme = (newTheme: Theme) => {
    setStorageItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  const value = {
    theme,
    setTheme,
  }

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
