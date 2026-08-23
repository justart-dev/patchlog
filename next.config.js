/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Silence Turbopack vs Webpack config conflict
  serverExternalPackages: ["playwright", "@playwright/test"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shared.akamai.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
      },
    ],
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: "/patch/:id/",
        destination: "/patch/:id",
        permanent: true,
      },
    ];
  },
  async headers() {
    const indexableHeaders = [
      {
        key: "X-Robots-Tag",
        value: "index, follow",
      },
    ];
    const varyAcceptHeaders = [
      ...indexableHeaders,
      { key: "Vary", value: "Accept, Accept-Encoding" },
    ];

    return [
      {
        source: "/",
        headers: varyAcceptHeaders,
      },
      {
        source: "/patch",
        headers: varyAcceptHeaders,
      },
      {
        source: "/patch/:path*",
        headers: varyAcceptHeaders,
      },
      {
        source: "/sitemap.xml",
        headers: indexableHeaders,
      },
      {
        source: "/robots.txt",
        headers: indexableHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
