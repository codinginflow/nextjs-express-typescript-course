/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    deviceSizes: [576, 768, 992, 1200, 1400],
  }
}

module.exports = nextConfig
