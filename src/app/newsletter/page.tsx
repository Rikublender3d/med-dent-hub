import { Metadata } from 'next'
import NewsletterForm from '@/components/forms/NewsletterForm'

export const metadata: Metadata = {
  title: '医科歯科連携マニュアル＆フォーマット ダウンロード',
  description:
    '医科歯科連携マニュアルとフォーマットをダウンロードできます。登録後、メールでダウンロード用リンクをお届けします。医者と歯医者の交換日記のメルマガにも同時にご登録いただきます。',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 rounded-lg border-2 border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-base leading-7 text-amber-900">
            資料は現在準備中です。出来上がり次第メールをお送りいたしますので下記のフォームにご入力ください。
          </p>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-[color:var(--foreground)]">
          医科歯科連携マニュアル＆フォーマット ダウンロードページ
        </h1>

        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
          <h2 className="mb-2 text-lg font-semibold text-[color:var(--foreground)]">
            登録特典のPDFについて
          </h2>
          <p className="text-sm leading-7 text-gray-700">
            現場でそのまま使えるチェックリストや連携のポイント、フォーマット例をまとめた資料をダウンロードいただけます。
            登録完了メールにダウンロード用リンクが記載されます。
            あわせて、医者と歯医者の交換日記の最新情報や医療・歯科のお役立ち情報をメールでお届けします。
          </p>
        </div>

        <div className="mb-10">
          <NewsletterForm />
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            個人情報の取り扱いについて
          </h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            ご登録いただいた個人情報は、マニュアルの送付・メルマガ配信以外の目的では使用いたしません。
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
