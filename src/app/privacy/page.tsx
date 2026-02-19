import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー - 医者と歯医者の交換日記',
  description:
    '医者と歯医者の交換日記のプライバシーポリシーです。個人情報の取り扱い方針について記載しています。',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[color:var(--foreground)]">
          プライバシーポリシー
        </h1>

        <p className="mb-10 leading-7 text-[color:var(--foreground)]">
          当サイト（以下「当サイト」といいます。）は、利用者の個人情報の重要性を認識し、個人情報の保護に関する法律（以下「個人情報保護法」）および関連法令を遵守するとともに、以下のプライバシーポリシーに従い、適切な取扱いおよび保護に努めます。
        </p>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">1. 個人情報の定義</h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            本ポリシーにおいて「個人情報」とは、個人情報保護法に定義される、生存する個人に関する情報であって、氏名、メールアドレス、電話番号、その他特定の個人を識別できる情報を指します。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">2. 個人情報の取得方法</h2>
          <p className="mb-3 leading-7 text-[color:var(--foreground)]">
            当サイトは、以下の方法により個人情報を取得することがあります。
          </p>
          <ul className="list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>お問い合わせフォームの送信</li>
            <li>メールマガジン登録、資料請求、各種申込み</li>
            <li>Cookie等を用いたアクセス情報の取得</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">3. 個人情報の利用目的</h2>
          <p className="mb-3 leading-7 text-[color:var(--foreground)]">
            当サイトは、取得した個人情報を以下の目的で利用します。
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>当サイトのサービス・コンテンツの提供および運営のため</li>
            <li>お問い合わせへの回答や必要なご連絡のため</li>
            <li>サービスの改善、品質向上、利用状況の分析のため</li>
            <li>不正行為や不正アクセスの防止、セキュリティ確保のため</li>
          </ul>
          <p className="mb-3 leading-7 text-[color:var(--foreground)]">
            また、以下の目的で利用する場合があります。
          </p>
          <ul className="mb-3 list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>
              当サイトまたは関連サービス、商品、キャンペーン等に関するプロモーション、マーケティング情報、電子メール・メルマガ等の配信
            </li>
          </ul>
          <p className="text-sm leading-7 text-[color:var(--foreground)]">
            ※これらの配信は、利用者の同意を得た場合、または法令に基づき許容される場合に限り行います。
            <br />
            ※利用者は、いつでも配信停止（オプトアウト）を行うことができます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            4. Cookie（クッキー）およびアクセス解析について
          </h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            当サイトでは、利便性向上や利用状況分析のため、Cookieを使用する場合があります。
            Cookieにより収集される情報には、個人を特定する情報は含まれません。
            <br />
            利用者は、ブラウザの設定によりCookieを無効にすることが可能ですが、その場合、一部機能が利用できなくなることがあります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            5. 個人情報の第三者提供について
          </h2>
          <p className="mb-3 leading-7 text-[color:var(--foreground)]">
            当サイトは、次の場合を除き、利用者の同意なく個人情報を第三者に提供することはありません。
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>法令に基づく場合</li>
            <li>
              人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難な場合
            </li>
          </ul>
          <p className="mb-3 leading-7 text-[color:var(--foreground)]">
            ただし、以下のような場合には、個人情報を第三者に提供することがあります。
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-[color:var(--foreground)]">
            <li>メール配信、システム運用、顧客管理等を委託する業務委託先</li>
            <li>広告配信、アクセス解析等を行うサービス提供事業者</li>
            <li>当サイトの関連会社、業務提携先</li>
          </ul>
          <p className="leading-7 text-[color:var(--foreground)]">
            これらの場合、当サイトは、適切な契約および管理体制を通じて、個人情報の安全管理を徹底します。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">6. 個人情報の安全管理</h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            当サイトは、個人情報への不正アクセス、紛失、漏えい、改ざん等を防止するため、合理的かつ適切な安全管理措置を講じます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            7. 外部サービスへのリンクについて
          </h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            当サイトには、外部サイトへのリンクが含まれる場合があります。
            リンク先サイトにおける個人情報の取扱いについては、当サイトは一切責任を負いません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            8. 個人情報の開示・訂正・削除等
          </h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            利用者は、自己の個人情報について、開示、訂正、利用停止、削除等を求めることができます。
            これらの請求については、合理的な範囲で速やかに対応いたします。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">
            9. プライバシーポリシーの変更
          </h2>
          <p className="leading-7 text-[color:var(--foreground)]">
            当サイトは、法令の変更や運営方針の見直し等により、本ポリシーを変更することがあります。
            変更後のプライバシーポリシーは、本サイトに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">10. お問い合わせ窓口</h2>
          <p className="mb-3 leading-7 text-[color:var(--foreground)]">
            個人情報の取扱いに関するお問い合わせは、以下までご連絡ください。
          </p>
          <address className="not-italic leading-8 text-[color:var(--foreground)]">
            <p>住所：東京都豊島区西池袋3丁目21番13-1710号</p>
            <p>法人名：一般社団法人正しい医療知識を広める会</p>
            <p>代表者：関　秀行（代表理事）</p>
            <p>
              Email:{' '}
              <a
                href="mailto:info@tadashiiiryou.or.jp"
                className="text-[color:var(--accent)] underline"
              >
                info@tadashiiiryou.or.jp
              </a>
            </p>
          </address>
        </section>
      </div>
    </div>
  )
}
