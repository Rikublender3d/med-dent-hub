import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function applySecurityHeaders(response: NextResponse) {
  // CSP設定: unsafe-evalとunsafe-inlineを最小限に
  // Next.jsの開発モードではunsafe-evalが必要な場合があるため、本番環境でのみ厳格化
  const isProduction = process.env.NODE_ENV === 'production'

  // 本番環境ではunsafe-evalを削除、開発環境では必要に応じて保持
  const scriptSrc = isProduction
    ? "'self' 'unsafe-inline' https://www.youtube.com https://platform.twitter.com https://www.googletagmanager.com https://cdn.iframe.ly"
    : "'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://platform.twitter.com https://www.googletagmanager.com https://cdn.iframe.ly"

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.microcms-assets.io https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.youtube.com https://platform.twitter.com https://cdn.iframe.ly;
    frame-ancestors 'none';
    connect-src 'self' https://*.microcms.io https://www.google-analytics.com https://www.googletagmanager.com https://cdn.iframe.ly;
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
