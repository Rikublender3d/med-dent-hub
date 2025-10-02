import { getArticles, getCategories } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'

export default async function Home() {
  const [{ contents }, categoriesRes, popularRes] = await Promise.all([
    getArticles(),
    getCategories(),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/popular-articles`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }).then(res => res.json()).catch(() => ({ articles: [] })),
  ])
  const categories = categoriesRes.contents
  const popularArticles = popularRes.articles || []
  const sortedByNewest = [...contents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  return (
    <div className="py-8 sm:py-10">
      {/* Hero */}
      <section className="mb-10 rounded-2xl bg-[color:var(--accent)] text-white">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
            医科歯科連携で、より良い医療を
          </h1>
          <p className="text-white/90">
            最新の知見と実践的な情報を共有し、医療の質向上を目指します
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-white/95 sm:max-w-md">
            <div>
              <div className="text-xl font-bold">1,247</div>
              <div className="text-xs opacity-90">記事</div>
            </div>
            <div>
              <div className="text-xl font-bold">892</div>
              <div className="text-xs opacity-90">医療従事者</div>
            </div>
            <div>
              <div className="text-xl font-bold">156</div>
              <div className="text-xs opacity-90">症例相談</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main column */}
        <div className="lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">人気の記事</h2>
            <a
              href="/posts"
              className="text-sm text-[color:var(--accent)] hover:underline"
            >
              すべて見る →
            </a>
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            {popularArticles.slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
            新着記事
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedByNewest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="border-frame mb-6 rounded-xl border bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold">カテゴリー</h4>
            <ul className="space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <a
                    href={`/posts?category=${c.id}`}
                    className="hover:underline"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-frame rounded-xl border bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold">アクティブユーザー</h4>
            <ul className="space-y-3 text-sm">
              {['森田 健一', '加藤 由美', '佐藤 花子'].map((n) => (
                <li key={n} className="flex items-center justify-between">
                  <span>{n}</span>
                  <span className="text-[color:var(--frame)]">内科/歯科</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
