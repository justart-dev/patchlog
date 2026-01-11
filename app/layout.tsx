import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { ClerkProvider } from "@clerk/nextjs";
import { WebSiteStructuredData } from "./components/StructuredData";
import { ThemeProvider } from "@/lib/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  title: {
    default: "마블 라이벌즈 한글 패치노트 | 패치로그",
    template: "%s | 패치로그",
  },
  description: "마블 라이벌즈(Marvel Rivals) 최신 패치노트를 한글로 번역해드립니다. 아이언맨, 토르, 스파이더맨 등 33개 히어로의 밸런스 변경, 맵 업데이트, 메타 변화를 놓치지 마세요. 매일 자동 업데이트되는 정확한 패치 정보를 확인하세요.",
  keywords: [
    "스팀 패치노트", "Steam 패치노트", "한글 패치노트", "게임 패치", "마블 라이벌즈", "Marvel Rivals", "패치 번역", "게임 업데이트", "스팀 게임", "패치 정보",
    "히어로 밸런스", "스킬 버프", "스킬 너프", "맵 업데이트", "메타 변경", "티어 리스트", "캐리 추천", "공격형 캐릭터", "방어형 캐릭터", "탱커 캐릭터", "서포터 캐릭터",
    "한글 번역", "패치노트 번역", "게임 가이드", "히어로 가이드", "스킬 설명", "공략", "플레이 팁",
    "아이언맨 패치", "토르 패치", "헐크 패치", "스파이더맨 패치", "캡틴 아메리카 패치", "블랙위도우 패치", "호크아이 패치",
    "블랙팬서 패치", "닥터스트레인지 패치", "스칼렛위치 패치", "윈터솔져 패치", "스타로드 패치", "맨티스 패치", "아담워록 패치",
    "매그니토 패치", "울버린 패치", "피닉스 패치", "스톰 패치", "닥터스트레인지 패치", "엠마 프로스트 패치", "마이클 패치"
  ],
  authors: [{ name: "Patchlog" }],
  creator: "Patchlog",
  publisher: "Patchlog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "스팀 게임 한글 패치노트 | 패치로그",
    description: "스팀(Steam) 게임의 최신 패치노트를 한글로 번역. 마블 라이벌즈 등 다양한 게임의 업데이트 정보를 확인하세요.",
    url: baseUrl,
    siteName: "패치로그 - 스팀 게임 한글 패치노트",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "스팀 게임 한글 패치노트 - 패치로그",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "스팀 게임 한글 패치노트 | 패치로그",
    description: "스팀 게임 한글 패치노트와 업데이트 정보",
    images: ["/images/thumbnail.png"],
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('patchlog-ui-theme') || 'system';
                  let actualTheme = theme;
                  if (theme === 'system') {
                    actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(actualTheme);
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
          <ThemeProvider>
            <WebSiteStructuredData />
            <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
                <Navbar />
              </div>
            </div>
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
            </main>
            <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
                <Footer />
              </div>
            </div>
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
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
