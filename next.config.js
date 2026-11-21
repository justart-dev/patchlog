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
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is https://*.clerk.accounts.dev https://clerk.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https:",
          "frame-src https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "worker-src 'self' blob:",
          "object-src 'none'",
        ].join("; "),
      },
    ];

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
        source: "/:path*",
        headers: securityHeaders,
      },
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
