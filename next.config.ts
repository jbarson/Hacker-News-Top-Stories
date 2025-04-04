import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable ESLint during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'favicon.ico',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'icon.horse',
        pathname: '/icon/**',
      },
    ],
  },
  // Ignore test files during build
  webpack: (config, { isServer }) => {
    // Ignore test files
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    })
    
    return config
  },
}

export default nextConfig
