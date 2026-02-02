import { Metadata } from 'next'
import NewsletterForm from '@/components/forms/NewsletterForm'

export const metadata: Metadata = {
  title: '医科歯科連携マニュアル&フォーマットダウンロード',
  description:
    '医科歯科連携マニュアル&フォーマットをダウンロードいただけます。医療従事者の皆様にお役立ていただける資料をご用意しています。',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[color:var(--foreground)]">
          医科歯科連携マニュアル&フォーマットダウンロード
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          以下のフォームにご入力いただくと、医科歯科連携に役立つマニュアルとフォーマットをダウンロードいただけます
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
