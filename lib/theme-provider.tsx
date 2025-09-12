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
  const [theme, setThemeState] = useState<Theme>(() => {
    // 서버에서는 system으로 시작
    if (typeof window === 'undefined') return 'system'
    
    // 클라이언트에서는 즉시 localStorage에서 가져오기
    const storedTheme = getStorageItem(storageKey) as Theme
    return storedTheme || defaultTheme
  })
  const [mounted, setMounted] = useState(false)

  // 클라이언트에서만 localStorage 접근
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    console.log('🔄 Applying theme:', theme, 'mounted:', mounted)

    // 부드러운 전환을 위한 transition 클래스 추가
    root.classList.add('transition-colors', 'duration-300', 'ease-in-out')
    root.style.transition = 'background-color 0.3s ease-in-out, color 0.3s ease-in-out'

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      
      console.log('🖥️ System theme detected:', systemTheme)
      root.classList.add(systemTheme)
      return
    }

    console.log('✅ Adding theme class:', theme)
    root.classList.add(theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    console.log('🎨 Theme changing from', theme, 'to', newTheme)
    setStorageItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}