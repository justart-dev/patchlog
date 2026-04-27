const withPWAInit = require("next-pwa");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["playwright", "@playwright/test"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/patch/:id/',
        destination: '/patch/:id',
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
