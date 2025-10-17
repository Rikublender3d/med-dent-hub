import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー - 医師と歯医者の交換日記',
  description:
    '医師と歯医者の交換日記のプライバシーポリシーです。個人情報の取り扱い方針について記載しています。',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[color:var(--foreground)]">
          プライバシーポリシー
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          最終更新日: {new Date().toLocaleDateString('ja-JP')}
        </p>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">1. 基本方針</h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            本サイト「医師と歯医者の交換日記」（以下「当サイト」）は、ユーザーの個人情報の保護を重要な責務と認識し、関連法令およびガイドラインを遵守し、適切な取扱い・保護に努めます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">2. 収集する情報</h2>
          <ul className="list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>お問合せ時に取得する氏名、メールアドレス、所属等の情報</li>
            <li>Cookie 等を用いて取得するサイト利用状況（アクセス解析目的）</li>
            <li>その他、サービス提供に必要な範囲で取得する情報</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">3. 利用目的</h2>
          <ul className="list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>コンテンツやサービスの提供・改善のため</li>
            <li>お問い合わせへの回答のため</li>
            <li>不正利用の防止・セキュリティ強化のため</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            4. アクセス解析・Cookie について
          </h2>
          <p className="mb-3 leading-7">
            当サイトでは、ユーザーの利用状況を把握しサービス改善に活かす目的で、アクセス解析ツールを利用する場合があります。Cookie
            はブラウザ設定により無効化できますが、一部機能が利用できなくなる可能性があります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">5. 第三者提供</h2>
          <p className="leading-7">
            法令に基づく場合を除き、本人の同意なく第三者に個人情報を提供することはありません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">6. 安全管理措置</h2>
          <p className="leading-7">
            当サイトは、個人情報の漏えい、滅失又はき損の防止その他の個人情報の安全管理のため、合理的なセキュリティ対策を講じます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">7. 外部サービス</h2>
          <p className="leading-7">
            記事配信・画像等の取得に外部サービス（例:
            microCMS）を利用しています。これらのサービスでの情報の取り扱いは、各サービスのプライバシーポリシーに従います。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">8. 本ポリシーの変更</h2>
          <p className="leading-7">
            本ポリシーの内容は、法令変更やサービス内容に応じて予告なく変更される場合があります。重要な変更がある場合は、本ページでお知らせします。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">9. お問い合わせ</h2>
          <p className="leading-7">
            本ポリシーに関するお問い合わせは、以下までお願いいたします。
          </p>
          <p className="mt-2 text-[color:var(--foreground)]">
            メール:{' '}
            <a
              href="mailto:info@tadashiiiryou.or.jp"
              className="text-[color:var(--accent)] underline"
            >
              info@tadashiiiryou.or.jp
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
