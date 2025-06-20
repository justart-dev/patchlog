import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Patchlog",
    template: "%s | Patchlog",
  },
  description: "한글 스팀 패치 노트",
  openGraph: {
    title: "Patchlog - 스팀 게임 패치 노트",
    description: "한글로 제공되는 게임 패치 노트",
    url: baseUrl,
    siteName: "Patchlog",
    locale: "ko_KR",
    type: "website",
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
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
      </body>
    </html>
  );
}
