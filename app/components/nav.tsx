"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
  const mobileMenuId = "mobile-main-menu";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="relative pointer-events-auto transition-all duration-300">
      <div className="flex items-center gap-2 glass px-2.5 py-1.5 rounded-full shadow-ambient ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex items-center gap-1 sm:gap-2 px-1">
          <Link href="/" className="inline-flex items-center min-w-0 px-3 py-1.5">
            <p className="text-xs font-black tracking-tighter text-archive-zinc-950 dark:text-white">
              PATCHLOG
            </p>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.blank ? "_blank" : "_self"}
                rel={item.blank ? "noopener noreferrer" : undefined}
                className="px-4 py-2 text-[11px] font-bold tracking-tight text-archive-zinc-500 dark:text-archive-zinc-400 hover:text-archive-zinc-950 dark:hover:text-white rounded-full transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
              >
                {item.name}
              </Link>
            ))}
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
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-archive-zinc-500 hover:bg-black/5 dark:hover:bg-white/10 md:hidden transition-colors"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 glass p-1.5 rounded-2xl shadow-xl md:hidden border border-archive-zinc-200 dark:border-archive-zinc-800 animate-slide-up z-[120]">
          {navItems.map((item) => (
            <Link
              key={`${item.href}-mobile`}
              href={item.href}
              className="block px-4 py-2 text-[11px] font-bold text-archive-zinc-600 dark:text-archive-zinc-400 hover:text-archive-zinc-950 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
