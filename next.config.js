/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 600,
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
