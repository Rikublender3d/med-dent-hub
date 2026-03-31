import Link from 'next/link'
import Image from 'next/image'

const navSections = [
  {
    heading: 'コンテンツ',
    links: [
      { href: '/medical-articles', label: '記事一覧' },
      /* { href: '/articles', label: '全記事一覧' }, */
      /* { href: '/general', label: '一般向け' }, */
      { href: '/about', label: 'このサイトについて' },
    ],
  },
  {
    heading: 'サービス',
    links: [
      { href: '/newsletter', label: '資料ダウンロード' },
      { href: '/contact', label: 'お問い合わせ' },
    ],
  },
  {
    heading: 'サイト情報',
    links: [
      { href: '/privacy', label: 'プライバシーポリシー' },
      { href: '/terms', label: '利用規約' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-12 bg-[color:var(--foreground)]">
      <div className="container mx-auto px-4 pt-12 pb-20 md:pb-10">
        {/* 上段: ロゴ + ナビ */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          {/* ロゴ・サイト説明 */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/2.png"
                alt="医者と歯医者の交換日記"
                width={120}
                height={48}
                className="opacity-80 brightness-0 invert"
              />
            </Link>
            <p className="mt-3 max-w-[240px] text-[0.75rem] leading-relaxed text-white/40">
              医科と歯科のあいだにある 「見えないすきま」を埋めるメディア
            </p>
          </div>

          {/* ナビ列 */}
          {navSections.map((section) => (
            <div key={section.heading}>
              <h4 className="mb-3 text-[0.6875rem] font-bold tracking-widest text-white/30 uppercase">
                {section.heading}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.8125rem] text-white/55 transition-colors hover:text-white/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 区切り線 */}
        <div className="mt-10 border-t border-white/[0.06]" />

        {/* 下段: コピーライト + 運営法人 */}
        <div className="mt-6 text-[0.6875rem] text-white/30">
          <p>© {new Date().getFullYear()} 医者と歯医者の交換日記</p>
        </div>
      </div>
    </footer>
  )
}
