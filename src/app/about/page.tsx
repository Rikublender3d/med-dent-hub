import { Metadata } from 'next'
import SpBr from '@/components/SpBr'

export const metadata: Metadata = {
  title: 'このサイトについて - 医者と歯医者の交換日記',
  description:
    '医療の明日を、現場からよくする。医者と歯医者の交換日記は、医科歯科連携の判断に迷う場面で役立つ「現場で使える視点」をまとめたメディアです。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-[color:var(--foreground)] lg:text-5xl">
              医療の明日を、 <SpBr />
              現場からよくする
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              医者と歯医者の交換日記は、医科歯科連携の判断に迷う場面で役立つ
              <br />
              「現場で使える視点」をまとめたメディアです。
            </p>
            <p className="text-lg leading-relaxed text-gray-600">
              医師・歯科医師、そして患者さんやその <SpBr />
              ご家族の判断を支える情報を発信します。
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* このサイトについて */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                このサイトについて
              </h2>
              <div className="max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  医科と歯科のあいだにある <SpBr />
                  見えないすきま」を埋めるために <SpBr />
                  生まれたメディア
                </p>
              </div>
            </div>

            {/* はじめに */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                はじめに
              </h2>
              <div className="max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  口の変化が、血糖値の変動や心臓への負担にまで影響するのを知っていますか。
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  口腔と全身は密接につながっていますが、この関係性は医療者でも患者でも、十分に共有されていないのが現状です。
                </p>
                <p className="mb-6 text-lg leading-relaxed">たとえば、</p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-lg leading-relaxed">
                  <li>歯周病が血糖コントロールに影響する</li>
                  <li>誤嚥性肺炎を予防するために歯科ケアが欠かせない</li>
                  <li>
                    持病のある患者さんへの歯科治療に医科の確認が必要になる
                  </li>
                </ul>
                <p className="mb-6 text-lg leading-relaxed">
                  外来・病棟・在宅のどの現場でも、「もう医科だけ、歯科だけでは完結しない」ケースが確実に増えています。
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  一方で、こんな声も聞かれます。
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-2 text-lg leading-relaxed">
                  <li>連携したいけど、どのタイミングで共有すべきか迷う</li>
                  <li>持病のある患者さんの歯科治療ってどこまで安全なの？</li>
                  <li>在宅の情報共有が院ごとにバラバラで困っている</li>
                </ul>
                <p className="mb-6 text-lg leading-relaxed">
                  そして患者やご家族もまた、
                  <br />
                  「医科に行くべき？ 歯科に相談 <SpBr />
                  すべき？」「持病があっても治療して <SpBr />
                  大丈夫？」
                  <br />
                  と迷う場面が多くあります。
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  これらは、専門が異なるからこそ生まれる「すきま」です。
                  <br />
                  このすきまを埋めることが、患者の <SpBr />
                  安全と安心につながります。
                </p>
                <p className="text-lg leading-relaxed">
                  医師と歯医者の交換日記は、
                  <br />
                  医師・歯科医師・患者ーーすべての
                  <SpBr />
                  立場で「医科と歯科のつながり」を理解し、よりよい選択ができるよう支えるメディアです。
                </p>
                <p className="mt-6 text-lg leading-relaxed">
                  医師や歯科医師が現場で役立つ視点、治療の判断に必要な知識、患者が不安を解消し、自分の身体を守るための
                  <SpBr />
                  情報を届けていきます。
                </p>
              </div>
            </div>

            {/* このメディアが目指すもの */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                このメディアが目指すもの
              </h2>
              <div className="max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  医科と歯科が扱うテーマは異なりますが、「患者の健康を守る」ゴールは同じです。
                  <br />
                  患者にとっても、医科と歯科のつながりを知るのは「不安を減らす」手がかりになります。
                </p>

                {/* Goals Grid */}
                <div className="space-y-8">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-[color:var(--foreground)]">
                      ▷ 医師が「口腔ケアの
                      <SpBr />
                      必要性」を理解するきっかけに
                    </h3>
                    <ul className="ml-6 list-disc space-y-2 text-gray-700">
                      <li>
                        糖尿病患者の血糖コントロールが歯周治療で安定するケース
                      </li>
                      <li>
                        誤嚥性肺炎を予防するために
                        <SpBr />
                        歯科介入が必要な場面
                      </li>
                      <li>
                        心疾患・抗凝固薬患者の歯科治療で必要になる医科との連絡
                      </li>
                    </ul>
                    <p className="mt-4 text-gray-700">
                      こうした「医科だけでは完結しない領域」を明確にし、
                      <br />
                      日々の外来・病棟・在宅で役立つ
                      <SpBr />
                      視点として届けます。
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-[color:var(--foreground)]">
                      ▷ 歯科医師が「全身管理」を学ぶ入り口に
                    </h3>
                    <ul className="ml-6 list-disc space-y-2 text-gray-700">
                      <li>抗凝固薬を中断してよいか判断に迷う場面</li>
                      <li>
                        高血圧・心不全患者の
                        <SpBr />
                        チェアタイムとリスク管理
                      </li>
                      <li>糖尿病患者の治癒遅延の背景にある医学的要因</li>
                    </ul>
                    <p className="mt-4 text-gray-700">
                      歯科単独では判断しにくいポイントを、医科の考え方とともに言語化し、
                      <br />
                      「安全に診療を進めるための基礎」としてまとめていきます。
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-[color:var(--foreground)]">
                      ▷ 患者が「医科と歯科のつながり」を正しく理解する手がかりに
                    </h3>
                    <ul className="ml-6 list-disc space-y-2 text-gray-700">
                      <li>どちらに相談すべきか分からない</li>
                      <li>
                        持病があるけれど歯科治療は
                        <SpBr />
                        大丈夫？
                      </li>
                    </ul>
                    <p className="mt-4 text-gray-700">
                      こうした疑問にこたえる、実用的な情報をまとめ、
                      <br />
                      患者が医療を選択する力を育てる
                      <SpBr />
                      お手伝いをします。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 読者のみなさまへ */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                読者のみなさまへ
              </h2>
              <div className="max-w-none text-[color:var(--foreground)]">
                <p className="mb-6 text-lg leading-relaxed">
                  このメディアは、あなたの声で育っていきます。
                </p>
                <p className="mb-4 text-lg leading-relaxed">
                  「こんなテーマを知りたい」
                  <br />
                  「この症例を共有したい」
                  <br />
                  「取材に協力したい」
                  <br />
                  「悩んでいる連携課題がある」
                </p>
                <p className="mb-8 text-lg leading-relaxed">
                  そんな声をいつでもお寄せください。
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
                      取り上げてほしいテーマや
                      <SpBr />
                      記事のアイデアをお聞かせください。
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
                      取材、連携企画、情報提供など、お気軽にお問い合わせください。
                    </p>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--accent)] hover:underline"
                    >
                      お問い合わせフォームへ
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 運営企業 */}
            <div className="mb-16">
              <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)]">
                運営企業
              </h2>
              <div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                      一般社団法人
                      <SpBr />
                      正しい医療知識を広める会
                    </h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                      医療法人芯聖会
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="rounded-2xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent)]/90 p-8 text-center text-white">
              <h2 className="mb-4 text-2xl font-bold">
                一緒に、医療の未来を創りませんか。
              </h2>
              <p className="mb-4 text-lg opacity-90">
                医科と歯科がつながると、診療の選択肢は広がり、
                <br />
                患者にとっても「安心して相談できる場」となります。
              </p>
              <p className="mb-6 text-lg opacity-90">
                このメディアは、そのつながりを「現場から育てていく」ための拠点です。
                <br />
                日々の診療で生まれる疑問や、
                <SpBr />
                共有したい気づき。
                <br />
                その一つひとつが、別の現場の助けになり、患者の支えになります。
                <br />
                ともに学び、ともに発信し、これからの医療をつくっていきましょう。
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
