/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['shared.akamai.steamstatic.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
