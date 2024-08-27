/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 600,
  output: 'export',
  swcMinify: false,
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
