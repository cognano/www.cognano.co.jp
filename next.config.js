/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 600,
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack(config, { isServer }) {
    console.log('Webpack build config:', config)
    return config
  },
  images: {
    dangerouslyAllowSVG: true,
  },
  productionBrowserSourceMaps: true,
}

module.exports = nextConfig
