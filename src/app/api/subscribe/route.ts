import { Resend } from 'resend'
import { createCorsResponse, createCorsOptionsResponse } from '@/lib/api/cors'

const resend = new Resend(process.env.RESEND_API_KEY)

// ドメイン検証後: RESEND_FROM="医者と歯医者の交換日記 <info@ishatohaisha.com>"
// Segment: RESEND_SEGMENT_GENERAL（一般読者）, RESEND_SEGMENT_MEDICAL（医療従事者）
const FROM_EMAIL = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

const SEGMENT_IDS = {
  general: process.env.RESEND_SEGMENT_GENERAL,
  medical: process.env.RESEND_SEGMENT_MEDICAL,
} as const

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** 新API（contacts.create の segments）用。seg_ プレフィックスを除去し、UUID でなければ undefined */
function toSegmentIdForApi(id: string | undefined): string | undefined {
  if (!id || typeof id !== 'string') return undefined
  const raw = id.startsWith('seg_') ? id.slice(4) : id.trim()
  return UUID_REGEX.test(raw) ? raw : undefined
}

export async function OPTIONS() {
  return createCorsOptionsResponse()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, profession } = body as {
      email?: string
      name?: string
      profession?: string
    }

    if (!email || typeof email !== 'string') {
      return createCorsResponse(
        { success: false, error: 'メールアドレスは必須です' },
        400
      )
    }

    // Google Apps Script にリクエストをプロキシ（メルマガ用。Resend と併用）
    const scriptUrl =
      process.env.SUBSCRIBE_SCRIPT_URL ??
      'https://script.google.com/macros/s/AKfycbxDnimr6ZXAdCX0mHd20Z4zJvIpyj7N9IYEemqnfYFChoqnmWqcvEYW32C4Yv5yj54/exec'
    const params = new URLSearchParams({
      email,
      name: (typeof name === 'string' ? name : '') || '',
      profession: (typeof profession === 'string' ? profession : '') || '',
    })
    try {
      const googleRes = await fetch(`${scriptUrl}?${params.toString()}`)
      const googleData = await googleRes.json()
      if (!googleRes.ok) {
        console.warn(
          'Google Apps Script (subscribe):',
          googleRes.status,
          googleData
        )
      }
    } catch (googleErr) {
      console.warn('Google Apps Script (subscribe, skipped):', googleErr)
    }

    // 職種が「医療関係者以外」→ General Segment、それ以外 → 医療従事者 Segment
    const segmentKey = profession === '医療関係者以外' ? 'general' : 'medical'
    const segmentId = SEGMENT_IDS[segmentKey]

    //contacts.create でコンタクト作成とセグメント登録を一度に
    const segmentIdForApi = toSegmentIdForApi(segmentId)
    try {
      const nameParts = typeof name === 'string' ? name.trim().split(/\s+/) : []
      const firstName = nameParts[0] ?? ''
      const lastName = nameParts.slice(1).join(' ') ?? ''
      const { error: createError } = await resend.contacts.create({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        unsubscribed: false,
        ...(segmentIdForApi && { segments: [{ id: segmentIdForApi }] }),
      })
      if (createError) {
        console.warn('Resend contact create:', createError.message)
      }
      if (segmentId && !segmentIdForApi) {
        console.warn(
          'Resend segment skipped: RESEND_SEGMENT_* must be a valid UUID (e.g. 78261eea-8f8b-4381-83c6-79fa7120f1cf or seg_<UUID>). Current:',
          segmentId
        )
      }
    } catch (contactErr) {
      console.warn('Resend contact create (skipped):', contactErr)
    }

    if (!process.env.RESEND_API_KEY) {
      return createCorsResponse(
        { success: false, error: '送信設定がありません' },
        500
      )
    }

    // Segment に応じたウェルカムメール
    const isMedical = segmentKey === 'medical'
    const welcomeSubject = isMedical
      ? '【医者と歯医者の交換日記】医療従事者向けメルマガ登録ありがとうございます'
      : '【医者と歯医者の交換日記】メルマガ登録ありがとうございます'
    const welcomeBody = isMedical
      ? `
        <p>${name ? `${name}様` : '登録者様'}</p>
        <p>医者と歯医者の交換日記、医療従事者向けメルマガへご登録いただき、ありがとうございます。</p>
        ${profession ? `<p>職種：${profession}</p>` : ''}
        <p>医科歯科連携や現場で役立つ情報をお届けしてまいります。</p>
        <hr />
        <p style="color:#888;font-size:12px;">医者と歯医者の交換日記</p>
      `
      : `
        <p>${name ? `${name}様` : '登録者様'}</p>
        <p>医者と歯医者の交換日記メルマガへご登録いただき、ありがとうございます。</p>
        <p>医療・歯科に関するわかりやすい情報をお届けしてまいります。</p>
        <hr />
        <p style="color:#888;font-size:12px;">医者と歯医者の交換日記</p>
      `

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: welcomeSubject,
      html: welcomeBody.replace(/\n\s+/g, ' ').trim(),
    })

    if (error) {
      console.error('Resend send error:', error)
      const message = error.message ?? '送信に失敗しました'
      return createCorsResponse(
        { success: false, error: message, detail: String(error) },
        500
      )
    }

    return createCorsResponse({ success: true, data })
  } catch (error) {
    console.error('Subscribe error:', error)
    return createCorsResponse(
      { success: false, error: '送信に失敗しました' },
      500
    )
  }
}
