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
  { name: "시즌 티어표", href: "/tier" },
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
    <nav className="w-full px-1 sm:px-2 py-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="inline-flex items-center min-w-0">
            <p className="text-base font-black text-gray-900 dark:text-white">Patchlog</p>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.blank ? "_blank" : "_self"}
                rel={item.blank ? "noopener noreferrer" : undefined}
                className="group relative inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus-visible:outline-none"
              >
                {item.name}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-hero-blue-500 transition-all duration-200 group-hover:w-full group-focus-visible:w-full"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {mounted ? (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(241,245,249,0.98))] px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.96),rgba(15,23,42,0.98))] dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white">
                    로그인
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(241,245,249,0.98))] px-1.5 shadow-sm dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.96),rgba(15,23,42,0.98))]">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          "h-8 w-8 ring-0",
                        userButtonTrigger:
                          "rounded-xl focus:shadow-none focus-visible:ring-0",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </>
          ) : (
            <div className="h-11 w-16 rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80" aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(241,245,249,0.98))] text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.96),rgba(15,23,42,0.98))] dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white md:hidden"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id={mobileMenuId}
          className="md:hidden mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 space-y-1"
        >
          {navItems.map((item) => (
            <Link
              key={`${item.href}-mobile`}
              href={item.href}
              target={item.blank ? "_blank" : "_self"}
              rel={item.blank ? "noopener noreferrer" : undefined}
              className="group relative block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
