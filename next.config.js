/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  videos: {
    domains: ['51.222.240.217'],
  }
}

module.exports = nextConfig
