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

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "패치로그 | Patchlog",
    template: "%s | Patchlog",
  },
  description: "한글 스팀 패치 노트 - 최신 게임 업데이트와 패치 정보를 한글로 제공",
  keywords: ["패치노트", "스팀", "게임", "업데이트", "한글", "패치로그", "Steam", "게임 패치"],
  authors: [{ name: "Patchlog" }],
  creator: "Patchlog",
  publisher: "Patchlog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "패치로그 | Patchlog - 스팀 게임 패치 노트",
    description: "한글로 제공되는 최신 게임 패치 노트와 업데이트 정보",
    url: baseUrl,
    siteName: "패치로그 | Patchlog",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "패치로그 - 한글 스팀 패치 노트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "패치로그 | Patchlog",
    description: "한글 스팀 패치 노트",
    images: ["/og-image.png"],
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
    google: "google-site-verification-code",
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
          "text-black bg-white",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <body className="antialiased flex flex-col min-h-screen">
          <div className="w-full bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
              <Navbar />
            </div>
          </div>
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
          </main>
          <div className="w-full bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
              <Footer />
            </div>
          </div>
          <Analytics />
          <SpeedInsights />
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="281e61a4-5b43-473c-a852-bec5281dd36b"
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
