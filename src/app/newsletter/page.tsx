import { Metadata } from 'next'
import NewsletterForm from '@/components/forms/NewsletterForm'

export const metadata: Metadata = {
  title: 'メルマガ申し込み',
  description:
    '医者と歯医者の交換日記のメルマガにご登録ください。最新の医療情報や歯科情報をお届けします。',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[color:var(--foreground)]">
          メルマガ申し込み
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          医者と歯医者の交換日記の最新情報をお届けします
        </p>

        <div className="mb-10">
          <NewsletterForm />
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            個人情報の取り扱いについて
          </h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            ご登録いただいた個人情報は、メルマガ配信以外の目的では使用いたしません。
            詳細については、
            <a href="/privacy" className="text-[color:var(--accent)] underline">
              プライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>
      </div>
    </div>
  )
}
