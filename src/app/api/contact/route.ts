import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createCorsResponse, createCorsOptionsResponse } from '@/lib/api/cors'

// 環境変数から取得（.env.localのAPPS_SCRIPT_URLと一致させる）
const scriptUrl = process.env.APPS_SCRIPT_URL
const RESEND_FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

    // 送信者へ確認メール（Resend）
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      try {
        const resend = new Resend(apiKey)
        const confirmHtml = `<div style="font-family:sans-serif;max-width:560px;color:#212529;"><p style="font-size:16px;line-height:1.6;">${body.name}様</p><p style="font-size:15px;line-height:1.6;">お問い合わせいただきありがとうございます。以下の内容で受け付けました。担当者より折り返しご連絡いたします。</p><hr style="border:none;border-top:1px solid #dee2e6;margin:20px 0;" /><p style="font-size:14px;color:#495057;"><strong>件名：</strong>${escapeHtml(body.subject)}</p><p style="font-size:14px;color:#495057;white-space:pre-wrap;"><strong>お問い合わせ内容：</strong><br />${escapeHtml(body.message)}</p><hr style="border:none;border-top:1px solid #dee2e6;margin:20px 0;" /><p style="font-size:12px;color:#868e96;">医者と歯医者の交換日記</p></div>`
        const { error: sendError } = await resend.emails.send({
          from: RESEND_FROM,
          to: body.email,
          subject: '【医者と歯医者の交換日記】お問い合わせを受け付けました',
          html: confirmHtml,
        })
        if (sendError) {
          console.warn('Contact confirmation email failed:', sendError.message)
        }
      } catch (confirmErr) {
        console.warn('Contact confirmation email error:', confirmErr)
      }
    }

    return createCorsResponse({ success: true })
  } catch (error) {
    console.error('❌ Contact form submission error:', error)
    return createCorsResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to submit contact form.',
      },
      500
    )
  }
}

// OPTIONSリクエスト（CORS preflight）に対応
export async function OPTIONS() {
  return createCorsOptionsResponse()
}

// GETリクエストは許可しない
export async function GET() {
  return createCorsResponse(
    { error: 'Method not allowed. Please use POST.' },
    405
  )
}
