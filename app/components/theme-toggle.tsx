'use client'

import { useTheme } from '@/lib/theme-provider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, useRef } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) return <div className="w-8 h-8" />

  const themes = [
    { id: 'light', name: 'Light', icon: SunIcon },
    { id: 'dark', name: 'Dark', icon: MoonIcon },
    { id: 'system', name: 'System', icon: ComputerDesktopIcon },
  ] as const

  const CurrentIcon = themes.find((t) => t.id === theme)?.icon || ComputerDesktopIcon

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-archive-zinc-500 hover:text-archive-zinc-950 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 glass p-1.5 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-[110] animate-slide-up">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                theme === t.id
                  ? 'bg-archive-zinc-950 text-white dark:bg-white dark:text-archive-zinc-950'
                  : 'text-archive-zinc-600 dark:text-archive-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
