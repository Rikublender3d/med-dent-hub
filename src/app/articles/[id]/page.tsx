import {
  getArticleById,
  getArticles,
  getCategories,
} from '@/lib/microCMS/microcms'
import Image from 'next/image'
import Link from 'next/link'
import { SafeHTML } from '@/components/SafeHTML'
import { ArticleCard } from '@/components/ArticleCard'

interface Props {
  params: { id: string }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const [article, { contents: allArticles }, categoriesRes] = await Promise.all(
    [getArticleById(id), getArticles(), getCategories()]
  )

  const categories = categoriesRes.contents
  const sortedByNewest = [...allArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // 関連記事（同じカテゴリーの記事、最大3件）
  const relatedArticles = article.category
    ? sortedByNewest
        .filter(
          (a) => a.id !== article.id && a.category?.id === article.category?.id
        )
        .slice(0, 3)
    : sortedByNewest.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* メインコンテンツ */}
          <article className="lg:col-span-3">
            {article.eyecatch && (
              <Image
                src={article.eyecatch.url}
                alt={article.title}
                className="mb-6 aspect-video w-full rounded-lg bg-slate-50 object-cover shadow-md"
                width={1200}
                height={640}
              />
            )}

            <div className="mb-6">
              {article.category && (
                <div className="mb-4">
                  <Link
                    href={`/posts?category=${article.category.id}`}
                    className="inline-block rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--accent)]/20"
                  >
                    {article.category.name}
                  </Link>
                </div>
              )}
              <h1 className="mb-4 text-4xl leading-tight font-bold text-[color:var(--foreground)]">
                {article.title}
              </h1>
              <time className="text-gray-600">
                {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </time>
            </div>

            {/* 記事本文 */}
            <div className="prose prose-lg max-w-none text-[color:var(--foreground)]">
              <SafeHTML html={article.content} />
            </div>

            {/* CTA セクション */}
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent)]/90 p-8 text-center text-white">
              <h2 className="mb-4 text-2xl font-bold">
                医療の未来を一緒に創りませんか？
              </h2>
              <p className="mb-6 text-lg opacity-90">
                医師と歯科医師の連携を通じて、より良い医療を実現するために
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/posts"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[color:var(--accent)] transition-colors hover:bg-gray-100"
                >
                  他の記事を読む
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
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-[color:var(--accent)]"
                >
                  サイトについて
                </Link>
              </div>
            </div>

            {/* 関連記事 */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-[color:var(--foreground)]">
                  関連記事
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((relatedArticle) => (
                    <ArticleCard
                      key={relatedArticle.id}
                      article={relatedArticle}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* サイドバー */}
          <aside className="lg:col-span-1">
            <div className="space-y-6">
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
                          {new Date(article.publishedAt).toLocaleDateString(
                            'ja-JP'
                          )}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* カテゴリー */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                  カテゴリー
                </h3>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/posts?category=${category.id}`}
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-gray-50"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-500">
                          ({Math.floor(Math.random() * 20) + 1})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 人気記事 */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                  人気記事
                </h3>
                <ul className="space-y-4">
                  {sortedByNewest.slice(0, 5).map((article, index) => (
                    <li key={article.id} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent)] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <Link
                        href={`/articles/${article.id}`}
                        className="line-clamp-2 text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)]"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
