import {
  getArticles,
  getCategories,
  getFeaturedArticles,
  getTags,
} from '@/lib/microCMS/microcms'
import {
  getPopularArticles,
  getPopularArticlesWithFallback,
} from '@/lib/articles/popular'
import { ArticleCard } from '@/components/ArticleCard'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export default async function Home() {
  const [
    articlesRes,
    categoriesRes,
    tagsRes,
    popularArticlesFromAPI,
    featuredRes,
  ] = await Promise.all([
    getArticles(),
    getCategories(),
    getTags(),
    getPopularArticles(5), // Google Analyticsから取得
    getFeaturedArticles(6),
  ])

  const contents = articlesRes.contents
  const categories = categoriesRes.contents
  const tags = tagsRes.contents
  const sortedByNewest = [...contents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // 人気記事に含まれていない最新記事をフォールバックとして追加
  const popularArticles = getPopularArticlesWithFallback(
    popularArticlesFromAPI,
    sortedByNewest,
    5
  )

  const featuredArticles = featuredRes.contents

  // const featuredArticle = sortedByNewest[0]
  // const secondaryArticles = sortedByNewest.slice(1, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: Main Message */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-4xl leading-tight font-bold text-[color:var(--foreground)] lg:text-5xl">
                医療の明日を、
                <br />
                現場からよくする
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                医者と歯医者の交換日記は、医科歯科連携にまつわるお役立ち情報をお届けし、
                「医療の明日を、現場からよくする」ための一歩を後押しするメディアです。
              </p>
              <Link
                href="/about"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
              >
                サイトについて
              </Link>
            </div>

            {/* Right: Featured Article */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl bg-gray-100">
                <div className="relative aspect-square lg:aspect-[5/4]">
                  <Image
                    src="/med-dent-hub.webp"
                    alt="医療と歯科の連携"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[color:var(--foreground)]">
              注目の記事
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => {
              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="block"
                >
                  <article className="group h-full overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg">
                    {article.eyecatch && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={article.eyecatch.url}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {article.category && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-600">
                            {article.category.name}
                          </span>
                        </div>
                      )}
                      <h3 className="mb-3 line-clamp-2 text-lg leading-tight font-semibold text-[color:var(--foreground)]">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(article.publishedAt).toLocaleDateString(
                          'ja-JP'
                        )}
                      </p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles Sidebar */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Latest Articles */}
            <div className="lg:col-span-3">
              <h2 className="mb-8 text-2xl font-bold text-[color:var(--foreground)]">
                最新記事
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedByNewest.slice(0, 9).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-6">
                {/* Categories */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <ul className="space-y-3">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/articles?category=${category.id}`}
                          className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-gray-50"
                        >
                          <span>{category.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                      タグ
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
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

                {/* Popular Articles */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                    人気記事
                  </h3>
                  <ul className="space-y-4">
                    {popularArticles.map((article, index) => (
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
      </section>
    </div>
  )
}
