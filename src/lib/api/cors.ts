import { NextResponse } from 'next/server'

/**
 * CORSヘッダーを設定したNextResponseを作成
 */
export function createCorsResponse(data: unknown, status = 200): NextResponse {
  const response = NextResponse.json(data, { status })

  // CORSヘッダーを設定
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://www.ishatohaisha.com'
  )
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

/**
 * OPTIONSリクエスト用のCORSレスポンス
 */
export function createCorsOptionsResponse(): NextResponse {
  const response = new NextResponse(null, { status: 204 })

  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://www.ishatohaisha.com'
  )
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}
