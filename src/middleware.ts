import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // preview環境（develop ブランチ等）のみ Basic Auth をかける
  if (process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded)
      const [user, pass] = decoded.split(':')
      const validUser = process.env.BASIC_AUTH_USER ?? 'admin'
      const validPass = process.env.BASIC_AUTH_PASS
      if (validPass && user === validUser && pass === validPass) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Staging"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
