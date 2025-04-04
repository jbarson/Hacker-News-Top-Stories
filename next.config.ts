import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
}

export default nextConfig
