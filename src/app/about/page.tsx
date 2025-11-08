import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'このサイトについて - 医者と歯医者の交換日記',
  description:
    '医科と歯科のあいだにある「見えないすきま」を埋めるために生まれたメディアです。医師と歯科医師の連携を通じて、よりよい診療の形を模索します。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-[color:var(--foreground)] lg:text-5xl">
              このサイトについて
            </h1>
            <p className="text-lg leading-relaxed text-gray-600">
              医科と歯科のあいだにある「見えないすきま」を埋めるために生まれたメディア
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* はじめに */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                はじめに
              </h2>
              <div className="prose prose-lg max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  「医者と歯医者の交換日記」は、医科と歯科のあいだにある「見えないすきま」を埋めるために生まれたメディアです。
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  診療報酬の改定や地域包括ケアの推進など、医療の現場が変化するなかで、医師と歯科医師の連携はますます重要になっています。
                </p>
                <p className="text-lg leading-relaxed">
                  私たちは、両者の「対話」を通じて、よりよい診療・連携の形を模索していきます。
                </p>
              </div>
            </div>

            {/* このメディアが目指すもの */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                このメディアが目指すもの
              </h2>
              <div className="prose prose-lg max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  「医者と歯医者の交換日記」は、単なる情報発信メディアではありません。
                </p>
                <p className="mb-8 text-lg leading-relaxed">
                  医師と歯科医師が本音で語り合い、現場の知見を共有し、患者・社会に還元していく「対話の場」です。
                </p>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-[color:var(--foreground)]">
                      医師が「口腔ケアの重要性」を学ぶきっかけに
                    </h3>
                    <p className="text-sm text-gray-600">
                      全身疾患と口腔健康の関連性を理解し、より包括的な医療を提供できるよう支援します。
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-[color:var(--foreground)]">
                      歯科医師が「全身疾患の理解」を深めるヒントに
                    </h3>
                    <p className="text-sm text-gray-600">
                      口腔から見える全身の健康状態について、医科の視点を取り入れた診療のヒントを提供します。
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-[color:var(--foreground)]">
                      患者が「医科と歯科のつながり」を正しく理解する入り口に
                    </h3>
                    <p className="text-sm text-gray-600">
                      患者さんが自分の健康についてより深く理解し、適切な医療を受けるための情報を提供します。
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-xl bg-gradient-to-r from-[color:var(--accent)]/10 to-[color:var(--accent)]/5 p-8 text-center">
                  <p className="text-xl font-semibold text-[color:var(--foreground)]">
                    専門と専門の間にある「すきま」を、言葉と想いでつないでいきます。
                  </p>
                </div>
              </div>
            </div>

            {/* 読者のみなさまへ */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                読者のみなさまへ
              </h2>
              <div className="prose prose-lg max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  このメディアは、あなたの声によって育っていきます。
                </p>
                <p className="mb-8 text-lg leading-relaxed">
                  「こんなテーマを取り上げてほしい」「取材を受けたい」など、ぜひお気軽にご意見をお寄せください。
                </p>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                        <svg
                          className="h-5 w-5 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                        テーマリクエストフォーム
                      </h3>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">
                      取り上げてほしいテーマや記事のアイデアをお聞かせください。
                    </p>
                    <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      準備中
                    </span>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                        お問い合わせ
                      </h3>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">
                      取材のご依頼やご質問など、お気軽にお問い合わせください。
                    </p>
                    <a
                      href="mailto:info@tadashiiiryou.or.jp"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--accent)] hover:underline"
                    >
                      info@tadashiiiryou.or.jp
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="rounded-2xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent)]/90 p-8 text-center text-white">
              <h2 className="mb-4 text-2xl font-bold">
                一緒に医療の未来を創りませんか？
              </h2>
              <p className="mb-6 text-lg opacity-90">
                医師と歯科医師の連携を通じて、より良い医療を実現するために
              </p>
              <a
                href="/posts"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[color:var(--accent)] transition-colors hover:bg-gray-100"
              >
                記事を読む
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
