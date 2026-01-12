import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function applySecurityHeaders(response: NextResponse) {
  // CSP: Next.js 15推奨設定
  // 本番環境では'unsafe-inline'と'unsafe-eval'を削除
  // 開発環境のみ許可（React開発モードで必要）
  const isDevelopment = process.env.NODE_ENV === 'development'

  // 本番環境: 厳格なCSP（unsafe-inline/unsafe-evalなし）
  // 開発環境: 開発用に緩和（unsafe-inline/unsafe-evalあり）
  const scriptSrc = isDevelopment
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://www.googletagmanager.com https://cdn.iframe.ly https://www.google-analytics.com https://va.vercel-scripts.com"
    : "'self' https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://www.googletagmanager.com https://cdn.iframe.ly https://www.google-analytics.com https://va.vercel-scripts.com"

  const styleSrc = isDevelopment
    ? "'self' 'unsafe-inline' https://fonts.googleapis.com"
    : "'self' https://fonts.googleapis.com"

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src ${styleSrc};
    img-src 'self' blob: data: https://images.microcms-assets.io https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://cdn.iframe.ly;
    frame-ancestors 'none';
    connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://cdn.iframe.ly https://images.microcms-assets.io https://va.vercel-scripts.com;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  // X-Powered-Byヘッダーはnext.config.tsで無効化
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  const response = NextResponse.next()
  applySecurityHeaders(response)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
