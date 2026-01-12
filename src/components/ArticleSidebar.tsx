import Link from 'next/link'
import Image from 'next/image'
import type { Article, Category, Tag } from '@/types/microcms'

interface ArticleSidebarProps {
  categories: Category[]
  allTags: Tag[]
  sortedByNewest: Article[]
  sidebarPopular: Article[]
}

export const ArticleSidebar = ({
  categories,
  allTags,
  sortedByNewest,
  sidebarPopular,
}: ArticleSidebarProps) => {
  return (
    <aside className="lg:col-span-3">
      {/* カテゴリー */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
          カテゴリー
        </h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/articles?category=${category.id}`}
                className="block rounded-lg p-2 text-sm hover:bg-gray-50"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* タグ */}
      {allTags.length > 0 && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
            タグ
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/articles?tag=${tag.id}`}
                className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-[color:var(--accent)]"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="sticky top-24 space-y-6">
        {/* プロモーションバナー */}
        <div className="rounded-xl bg-[color:var(--accent)] p-6 text-white">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">メルマガ登録</h3>
          <p className="mb-4 text-sm opacity-90">
            最新の医療情報をメールでお届け
          </p>
          <Link
            href="/about"
            className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-[color:var(--accent)] hover:bg-gray-100"
          >
            登録する
          </Link>
        </div>
        {/* 人気記事 */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 border-b-2 border-[color:var(--accent)] pb-2 text-xl font-bold text-[color:var(--foreground)]">
            人気記事
          </h3>
          <ul>
            {sidebarPopular.map((item, index) => (
              <li
                key={item.id}
                className={`relative ${
                  index < sidebarPopular.length - 1
                    ? 'border-b border-gray-200'
                    : ''
                }`}
              >
                <Link
                  href={`/articles/${item.id}`}
                  className="flex items-center gap-3 py-4 transition-opacity hover:opacity-80"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  {item.eyecatch && (
                    <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={item.eyecatch.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <span className="line-clamp-2 flex-1 text-sm font-medium text-[color:var(--foreground)]">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 最新記事 */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
            最新記事
          </h3>
          <ul className="space-y-4">
            {sortedByNewest.slice(0, 5).map((article) => (
              <li key={article.id}>
                <Link
                  href={`/articles/${article.id}`}
                  className="block rounded-lg p-3 hover:bg-gray-50"
                >
                  <h4 className="mb-1 line-clamp-2 text-sm font-medium text-[color:var(--foreground)]">
                    {article.title}
                  </h4>
                  <time className="text-xs text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
