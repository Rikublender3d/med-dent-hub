import { NextResponse } from 'next/server'

// 環境変数から取得（.env.localのAPPS_SCRIPT_URLと一致させる）
const scriptUrl = process.env.APPS_SCRIPT_URL

interface ContactPayload {
  name: string
  email: string
  phone?: string
  organization?: string
  profession?: string
  subject: string
  message: string
  agree: boolean
}

interface GoogleScriptResponse {
  success: boolean
  error?: string
}

export async function POST(request: Request) {
  // デバッグ用ログ
  console.log('=== Contact API Debug ===')
  console.log('Script URL exists:', !!scriptUrl)
  console.log('Script URL:', scriptUrl)

  if (!scriptUrl) {
    console.error(
      '❌ APPS_SCRIPT_URL is not configured in environment variables'
    )
    return NextResponse.json(
      { success: false, error: 'Contact script URL is not configured.' },
      { status: 500 }
    )
  }

  try {
    const body = (await request.json()) as ContactPayload

    console.log('📤 Sending data to Google Apps Script:', {
      name: body.name,
      email: body.email,
      hasPhone: !!body.phone,
      hasOrganization: !!body.organization,
      profession: body.profession,
      subject: body.subject,
      messageLength: body.message?.length,
    })

    // 必須フィールドのバリデーション
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error:
            'お名前、メールアドレス、件名、お問い合わせ内容は必須項目です。',
        },
        { status: 400 }
      )
    }

    // Google Apps ScriptにPOSTリクエストを送信
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        organization: body.organization || '',
        profession: body.profession || '',
        subject: body.subject,
        message: body.message,
      }),
      redirect: 'follow', // Apps Scriptのリダイレクトに対応
    })

    console.log('📥 Google Apps Script response status:', response.status)

    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Apps Script error:', text)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to submit contact form. Status: ${response.status}`,
        },
        { status: 502 }
      )
    }

    const data: GoogleScriptResponse = await response.json()
    console.log('✅ Apps Script response:', data)

    if (!data.success) {
      throw new Error(data.error || 'フォームの送信に失敗しました。')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Contact form submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to submit contact form.',
      },
      { status: 500 }
    )
  }
}

// GETリクエストは許可しない
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Please use POST.' },
    { status: 405 }
  )
}
