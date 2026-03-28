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
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 scale-0 rounded-full bg-hero-blue-500 transition-transform duration-200 group-hover:scale-100 group-focus-visible:scale-100"
                />
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
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    로그인
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : (
            <div className="h-8 w-16" aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 scale-0 rounded-full bg-hero-blue-500 transition-transform duration-200 group-hover:scale-100"
              />
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
