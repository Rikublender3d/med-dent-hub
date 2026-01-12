import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function applySecurityHeaders(response: NextResponse) {
  // CSP: Next.js 15のビルド時に生成されるインラインスクリプトに対応
  // 'strict-dynamic'を使用して、信頼できるスクリプトから読み込まれたスクリプトを許可
  // 'unsafe-inline'はNext.jsのビルド時に生成されるインラインスクリプトのために必要
  // ただし、'strict-dynamic'と組み合わせることで、セキュリティリスクを最小化
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'strict-dynamic' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://www.googletagmanager.com https://cdn.iframe.ly https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.microcms-assets.io https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://platform.twitter.com https://cdn.iframe.ly;
    frame-ancestors 'none';
    connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://cdn.iframe.ly https://images.microcms-assets.io;
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
