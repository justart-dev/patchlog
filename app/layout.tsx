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
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
    shortcut: "/icon",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "vhwJw57Gjn2GqP4ls2gFNnU2QPZLp9OwT6g7aOxP3yM",
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="ko"
        className={cx(
          GeistSans.variable,
          GeistMono.variable
        )}
        suppressHydrationWarning
      >
        <head>
          <Script id="theme-init" strategy="beforeInteractive">
            {`
              try {
                const theme = localStorage.getItem('patchlog-ui-theme') || 'system';
                const actualTheme =
                  theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                document.documentElement.classList.add(actualTheme);
              } catch (e) {}
            `}
          </Script>
        </head>
        <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
          <ThemeProvider>
            <WebSiteStructuredData />
            <div className="w-full bg-white dark:bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <Navbar />
              </div>
            </div>
            <main className="flex-grow">
              {children}
            </main>
            <div className="w-full bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <Footer />
              </div>
            </div>
          </ThemeProvider>
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
