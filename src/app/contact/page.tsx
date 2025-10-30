import type { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'お問い合わせ - 医師と歯医者の交換日記',
  description:
    '医師と歯医者の交換日記へのお問い合わせページです。ご意見・ご要望・ご連絡はこちらからお寄せください。',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[color:var(--foreground)]">
          お問い合わせ
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          ご意見・ご質問・ご依頼などがございましたら、以下のフォームよりお気軽にご連絡ください。
        </p>
        <ContactForm />
      </div>
    </div>
  )
}
