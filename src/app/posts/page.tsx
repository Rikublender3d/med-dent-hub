import { getArticles } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 60

export default async function PostsPage() {
  const { contents } = await getArticles()
  const sorted = [...contents].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-bold">記事一覧</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}


