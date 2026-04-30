"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "./theme-toggle";

type NavItem = {
  name: string;
  href: string;
  blank?: boolean;
};

const navItems: NavItem[] = [
  { name: "소개", href: "/" },
  { name: "패치노트", href: "/patch" },
  { name: "사이트 통계", href: "https://cloud.umami.is/share/X4DLIuA7E54r6Fi9", blank: true },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative pointer-events-auto transition-all duration-300" ref={navRef}>
      <div className="flex items-center gap-2 glass px-2.5 py-1.5 rounded-full shadow-ambient ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex items-center gap-1 sm:gap-2 px-1">
          <Link href="/" className="inline-flex items-center min-w-0 px-3 py-1.5">
            <p className="text-xs font-black tracking-tighter text-archive-zinc-950 dark:text-white">
              PATCHLOG
            </p>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.blank ? "_blank" : "_self"}
                  rel={item.blank ? "noopener noreferrer" : undefined}
                  prefetch={item.href === "/patch" ? false : undefined}
                  className={`px-4 py-2 text-[11px] font-bold tracking-tight rounded-full transition-all ${
                    isActive
                      ? "text-archive-zinc-950 dark:text-white bg-black/[0.04] dark:bg-white/[0.06]"
                      : "text-archive-zinc-500 dark:text-archive-zinc-400 hover:text-archive-zinc-950 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="h-4 w-px bg-archive-zinc-200 dark:bg-archive-zinc-800 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1 sm:gap-1.5 px-1">
          <ThemeToggle />

          {mounted ? (
            <div className="min-w-[70px] flex items-center justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="h-8 px-4 text-[10px] font-black tracking-widest uppercase text-white bg-hero-red-500 hover:bg-hero-red-600 rounded-full transition-all active:scale-95 shadow-sm shadow-hero-red-500/20">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-archive-zinc-100 dark:bg-archive-zinc-800 ring-1 ring-black/5 dark:ring-white/10">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-6 w-6",
                        userButtonTrigger: "rounded-full focus:shadow-none focus-visible:ring-0",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          ) : (
            <div className="h-8 min-w-[70px] rounded-full bg-archive-zinc-100 dark:bg-archive-zinc-800 animate-pulse" />
          )}

          <div className="relative md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-archive-zinc-500 hover:text-archive-zinc-950 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all"
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-32 glass p-1.5 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-[110] animate-slide-up">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={`${item.href}-mobile`}
                      href={item.href}
                      target={item.blank ? "_blank" : "_self"}
                      rel={item.blank ? "noopener noreferrer" : undefined}
                      prefetch={item.href === "/patch" ? false : undefined}
                      className={`flex w-full items-center px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                        isActive
                          ? "bg-archive-zinc-950 text-white dark:bg-white dark:text-archive-zinc-950"
                          : "text-archive-zinc-600 dark:text-archive-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
