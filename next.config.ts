import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://embed.ted.com https://platform.twitter.com https://www.slideshare.net https://speakerdeck.com https://www.instagram.com https://www.facebook.com https://www.tiktok.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://platform.twitter.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
