"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  blank?: boolean;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    href: "/",
  },
  {
    name: "Marvel Rivals",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    href: "/patch",
  },
  {
    name: "Insights",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: "https://cloud.umami.is/share/X4DLIuA7E54r6Fi9",
    blank: true,
  },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full">
      <div className="flex justify-between items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.blank ? "_blank" : "_self"}
              rel={item.blank ? "noopener noreferrer" : ""}
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 transition-colors py-2"
            >
              <span className="text-base">{item.icon}</span>
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-500 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Theme toggle and Auth buttons */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors whitespace-nowrap">
                로그인
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 pb-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.blank ? "_blank" : "_self"}
              rel={item.blank ? "noopener noreferrer" : ""}
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-300">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </Link>
          ))}

        </div>
      )}
    </nav>
  );
}
