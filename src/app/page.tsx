import { getArticles, getCategories } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const [{ contents }, categoriesRes] = await Promise.all([
    getArticles(),
    getCategories(),
  ])
  const categories = categoriesRes.contents
  const sortedByNewest = [...contents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const featuredArticle = sortedByNewest[0]
  const secondaryArticles = sortedByNewest.slice(1, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: Main Message */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[color:var(--foreground)] lg:text-5xl">
                医療の明日が、<br />
                もっとよくなる
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                医師と歯医者の交換日記は、医科歯科連携にまつわるお役立ち情報をお届けし、
                「医療の明日が、もっとよくなる」ための一歩を後押しするメディアです。
              </p>
              <Link
                href="/about"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
              >
                サイトについて
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right: Featured Article */}
            {featuredArticle && (
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                  {featuredArticle.eyecatch ? (
                    <Image
                      src={featuredArticle.eyecatch.url}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[color:var(--accent)]/20 to-[color:var(--accent)]/40">
                      <div className="text-center text-white">
                        <div className="mb-2 text-4xl">📚</div>
                        <div className="text-sm">記事画像</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-sm font-medium">注目記事</span>
                  </div>
                  <h2 className="mb-2 text-xl font-bold line-clamp-2">
                    {featuredArticle.title}
                  </h2>
                  <Link
                    href={`/articles/${featuredArticle.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-300 hover:text-blue-200"
                  >
                    記事を読む
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[color:var(--foreground)]">注目の記事</h2>
            <Link
              href="/posts"
              className="flex items-center gap-1 text-sm text-[color:var(--accent)] hover:underline"
            >
              すべて見る
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedByNewest.slice(0, 6).map((article, index) => {
              const categoryColors = ['bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500']
              const categoryNames = ['医療連携', '症例研究', 'well-working', '診療技術', '患者ケア', '医学教育']
              
              return (
                <article key={article.id} className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg">
                  {article.eyecatch && (
                    <div className="relative h-48 overflow-hidden">
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
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${categoryColors[index % categoryColors.length]}`}></span>
                      <span className="text-sm font-medium text-gray-600">{categoryNames[index % categoryNames.length]}</span>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold leading-tight text-[color:var(--foreground)] line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                    </p>
                    <Link
                      href={`/articles/${article.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--accent)] hover:underline"
                    >
                      続きを読む
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles Sidebar */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Latest Articles */}
            <div className="lg:col-span-3">
              <h2 className="mb-8 text-2xl font-bold text-[color:var(--foreground)]">最新記事</h2>
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
                  <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">カテゴリー</h3>
                  <ul className="space-y-3">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/posts?category=${category.id}`}
                          className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-gray-50"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs text-gray-500">({Math.floor(Math.random() * 20) + 1})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popular Articles */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">人気記事</h3>
                  <ul className="space-y-4">
                    {sortedByNewest.slice(0, 5).map((article, index) => (
                      <li key={article.id} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent)] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)] line-clamp-2"
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
