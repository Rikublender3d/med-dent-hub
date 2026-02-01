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
  // X-Powered-Byヘッダーを無効化
  poweredByHeader: false,
  async headers() {
    // CSPヘッダーを設定（middleware.tsと統一させる）
    // Google Analytics: script-src に googletagmanager.com + unsafe-eval、connect-src / img-src に GA ドメインを許可
    const cspHeader =
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://cdn.iframe.ly https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https: https://images.microcms-assets.io https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://cdn.iframe.ly; frame-ancestors 'none'; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://cdn.iframe.ly https://images.microcms-assets.io; upgrade-insecure-requests;"

    return [
      {
        // APIエンドポイントにCORS設定を追加
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.ishatohaisha.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
      {
        // すべてのパスに適用（robots.txt、sitemap.xmlを含む）
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
