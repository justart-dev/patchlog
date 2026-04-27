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

module.exports = nextConfig;
