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
    unoptimized: true,
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

    return [
      {
        source: "/",
        headers: indexableHeaders,
      },
      {
        source: "/patch",
        headers: indexableHeaders,
      },
      {
        source: "/patch/:path*",
        headers: indexableHeaders,
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
