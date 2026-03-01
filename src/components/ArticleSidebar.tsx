import Link from 'next/link'
import Image from 'next/image'
import type { SidebarData } from '@/lib/microCMS/microcms'
import { CollapsibleSection } from '@/components/CollapsibleSection'

interface ArticleSidebarProps {
  sidebarData: SidebarData
  basePath?: string
}

export const ArticleSidebar = ({
  sidebarData,
  basePath = '/articles',
}: ArticleSidebarProps) => {
  const categories = sidebarData.categories.contents
  const allTags = sidebarData.tags.contents
  const latestArticles = sidebarData.latestArticles
  const popularArticles = sidebarData.popularArticles ?? []
  const sidebarListArticles =
    popularArticles.length > 0 ? popularArticles : latestArticles
  const sidebarListLabel = popularArticles.length > 0 ? '人気記事' : '最新記事'

  return (
    <aside className="lg:col-span-3">
      {/* ━━ カテゴリー ━━ */}
      <div className="mb-4">
        <CollapsibleSection title="カテゴリー" accent>
          <ul className="space-y-0.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`${basePath}?category=${category.id}`}
                  className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[color:var(--foreground)] transition-all hover:bg-[color:var(--accent)]/[0.04] hover:text-[color:var(--accent)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--frame)] transition-colors group-hover:bg-[color:var(--accent)]" />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      </div>

      {/* ━━ タグ ━━ */}
      {allTags.length > 0 && (
        <div className="mb-4">
          <CollapsibleSection title="タグ" accent>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`${basePath}?tag=${tag.id}`}
                  className="inline-block rounded-full border border-gray-200 bg-transparent px-3.5 py-1.5 text-[0.8125rem] font-medium text-gray-600 transition-all hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* ━━ sticky エリア: スクロール時に固定 ━━ */}
      <div className="sticky top-24 space-y-4">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            プロモバナー — 医科歯科連携マニュアル
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Link
          href="/newsletter"
          className="group relative block overflow-hidden rounded-2xl bg-[color:var(--accent)] transition-shadow hover:shadow-lg"
        >
          {/* 斜めのジオメトリック装飾 */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/[0.06]" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/[0.04]" />
            <div className="absolute right-12 bottom-8 h-2 w-2 rounded-full bg-white/20" />
            <div className="absolute top-4 left-1/3 h-1.5 w-1.5 rounded-full bg-white/15" />
          </div>

          <div className="relative px-5 py-5 lg:px-6 lg:py-7">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm lg:mb-4 lg:h-11 lg:w-11">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mb-1.5 text-base font-bold text-white lg:text-lg">
              医科歯科連携マニュアル
            </h3>
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-white/75 lg:text-sm">
              現場で使える実践ガイドを無料でお届け
            </p>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[0.8125rem] font-semibold text-[color:var(--accent)] transition-all group-hover:gap-3 group-hover:shadow-md">
              無料ダウンロード
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </div>
        </Link>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            人気記事 / 最新記事 ランキング
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-[color:var(--accent)]" />
              <h3 className="text-[0.8125rem] font-bold tracking-wide text-[color:var(--foreground)] uppercase">
                {sidebarListLabel}
              </h3>
            </div>
          </div>
          <ul>
            {sidebarListArticles.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`/${item.endpoint}/${item.id}`}
                  className="group relative flex items-start gap-3 border-b border-gray-50 px-5 py-4 transition-colors last:border-b-0 hover:bg-gray-50/60"
                >
                  {/* ランキング番号 — 大きなタイポグラフィ */}
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      index === 0
                        ? 'bg-[color:var(--accent)] text-white'
                        : index <= 2
                          ? 'bg-[color:var(--accent)]/10 text-[color:var(--accent)]'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm leading-snug font-medium text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--accent)]">
                      {item.title}
                    </span>
                    <time className="mt-1 block text-xs text-gray-400">
                      {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                    </time>
                  </div>

                  {/* サムネイル — デスクトップのみ */}
                  {item.eyecatch && (
                    <div className="relative hidden h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg lg:block">
                      <Image
                        src={item.eyecatch.url}
                        alt=""
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="56px"
                      />
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            最新記事
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-[color:var(--accent)]" />
              <h3 className="text-[0.8125rem] font-bold tracking-wide text-[color:var(--foreground)] uppercase">
                最新記事
              </h3>
            </div>
          </div>
          <ul>
            {latestArticles.slice(0, 5).map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`/${item.endpoint}/${item.id}`}
                  className="group flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-gray-50/60"
                >
                  <span className="text-[0.6875rem] font-bold text-gray-300 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm leading-snug font-medium text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--accent)]">
                      {item.title}
                    </h4>
                  </div>
                  <time className="flex-shrink-0 text-[0.6875rem] text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString('ja-JP', {
                      month: 'numeric',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* /sticky */}
    </aside>
  )
}
