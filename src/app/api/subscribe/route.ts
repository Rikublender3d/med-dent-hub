import { createCorsResponse, createCorsOptionsResponse } from '@/lib/api/cors'

export async function OPTIONS() {
  return createCorsOptionsResponse()
}

export async function POST(request: Request) {
  try {
    const { email, name, profession } = await request.json()

    // Google Apps ScriptにリクエストをProxyする
    const scriptUrl =
      'https://script.google.com/macros/s/AKfycbxDnimr6ZXAdCX0mHd20Z4zJvIpyj7N9IYEemqnfYFChoqnmWqcvEYW32C4Yv5yj54/exec'

    const params = new URLSearchParams({
      email,
      name,
      profession,
    })

    // サーバーサイドからのリクエストなのでCORS問題なし
    const response = await fetch(`${scriptUrl}?${params.toString()}`)

    const data = await response.json()

    return createCorsResponse({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return createCorsResponse(
      { success: false, error: 'Failed to submit' },
      500
    )
  }
}
