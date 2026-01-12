'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // ホームページではパンくずリストを表示しない
    if (pathname === '/') {
      return []
    }

    const items: BreadcrumbItem[] = [{ label: 'ホーム', href: '/' }]

    // パスを分割して処理
    const paths = pathname.split('/').filter(Boolean)

    // パスに基づいてパンくずリストを生成
    let currentPath = ''

    paths.forEach((path, index) => {
      currentPath += `/${path}`

      // ラベルの決定
      let label = path

      // 特定のパスに対してカスタムラベルを設定
      const pathLabels: Record<string, string> = {
        articles: '記事一覧',
        about: 'サイトについて',
        contact: 'お問い合わせ',
        newsletter: 'メルマガ',
        privacy: 'プライバシーポリシー',
        terms: '利用規約',
        search: '検索結果',
        categories: 'カテゴリー',
        profile: 'プロフィール',
        'medical-articles': '医療従事者向け',
        general: '一般の方向け',
        draft: '下書きプレビュー',
      }

      if (pathLabels[path]) {
        label = pathLabels[path]
      } else if (
        index === paths.length - 1 &&
        (paths[0] === 'articles' ||
          paths[0] === 'general' ||
          paths[0] === 'medical-articles' ||
          paths[0] === 'draft')
      ) {
        // 記事詳細ページの場合は「記事詳細」と表示
        label = '記事詳細'
      }

      items.push({
        label,
        href: currentPath,
      })
    })

    return items
  }, [pathname])

  // パンくずリストがない場合は何も表示しない
  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="パンくずリスト"
      className="border-gray-100 bg-white py-3"
      key={pathname}
    >
      <div className="container mx-auto px-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <li key={item.href} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="h-4 w-4 text-gray-400"
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
                )}
                {isLast ? (
                  <span
                    className="font-medium text-[color:var(--foreground)]"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 transition-colors hover:text-[color:var(--accent)]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
