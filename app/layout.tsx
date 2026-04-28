import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import Footer from "./components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { WebSiteStructuredData } from "./components/StructuredData";
import PWARegister from "./components/PWARegister";
import { ThemeProvider } from "@/lib/theme-provider";
import { buildCanonicalUrl, DEFAULT_OG_IMAGE, SITE_BRAND_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  title: {
    default: "마블 라이벌즈 한글 패치노트 | 패치로그",
    template: "%s | 패치로그",
  },
  description: "마블 라이벌즈 최신 패치노트를 한국어로 빠르게 확인하세요. 히어로 밸런스 조정, 시즌 업데이트, 맵 변경, 핵심 수치 변화를 읽기 쉽게 정리해 제공합니다.",
  keywords: [
    "마블 라이벌즈 패치노트",
    "Marvel Rivals patch notes",
    "마블 라이벌즈 한글",
    "마블 라이벌즈 번역",
    "마블 라이벌즈 밸런스 패치",
    "히어로 밸런스",
    "스킬 버프",
    "스킬 너프",
    "시즌 업데이트",
    "맵 변경"
  ],
  authors: [{ name: "Patchlog" }],
  creator: "Patchlog",
  publisher: "Patchlog",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "패치로그",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icons/icon-192.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "마블 라이벌즈 한글 패치노트 | 패치로그",
    description: "Marvel Rivals 최신 패치, 밸런스 변경, 시즌 업데이트를 한국어로 빠르게 확인하세요.",
    url: buildCanonicalUrl("/"),
    siteName: SITE_BRAND_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "마블 라이벌즈 한글 패치노트 - 패치로그",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "마블 라이벌즈 한글 패치노트 | 패치로그",
    description: "Marvel Rivals 패치노트와 밸런스 변경을 한국어로 정리한 Patchlog",
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    google: "vhwJw57Gjn2GqP4ls2gFNnU2QPZLp9OwT6g7aOxP3yM",
  },
};

const cx = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="ko"
        className={cx(GeistSans.variable, GeistMono.variable)}
        suppressHydrationWarning
      >
        <head>
          <meta name="theme-color" content="#ffffff" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
          <WebSiteStructuredData />
          <Script id="theme-init" strategy="beforeInteractive">
            {`
              try {
                const theme = localStorage.getItem('patchlog-ui-theme') || 'system';
                const actualTheme =
                  theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                document.documentElement.classList.toggle('dark', actualTheme === 'dark');
              } catch (e) {}
            `}
          </Script>
        </head>
        <body className="antialiased flex flex-col min-h-screen bg-archive-zinc-50 dark:bg-archive-zinc-950 text-archive-zinc-900 dark:text-archive-zinc-50 overflow-x-hidden selection:bg-hero-red-500 selection:text-white" suppressHydrationWarning>
          <ThemeProvider>
            {/* Global Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
              <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-hero-blue-500/10 blur-[80px] dark:bg-hero-blue-500/15" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-hero-red-500/10 blur-[80px] dark:bg-hero-red-500/15" />
              <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none bg-noise" />
            </div>

            {/* Floating Navbar Container */}
            <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 sm:p-6 pointer-events-none">
              <Navbar />
            </div>

            {/* The single, definitive semantic main tag for the entire site */}
            <main className="flex-grow pt-24 sm:pt-28 relative z-10" suppressHydrationWarning>
              {children}
            </main>

            <footer className="w-full bg-archive-zinc-100/5 dark:bg-archive-zinc-900/10 border-t border-archive-zinc-200/50 dark:border-archive-zinc-800/30 mt-12 relative z-10">
              <div className="max-w-7xl mx-auto px-6 py-2">
                <Footer />
              </div>
            </footer>
          </ThemeProvider>
          <PWARegister />
          <Analytics />
          <SpeedInsights />
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6198824361218150"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="83fbc50b-56e9-473d-be24-ea6801d81058"
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
