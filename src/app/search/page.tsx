import { getArticles } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 30

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const { contents } = await getArticles(q ? { q, limit: 50 } : { limit: 24 })

  const articlesWithEndpoint = contents.map((article) => ({
    article,
    endpoint: article.endpoint,
  }))

  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">検索</h1>
      <p className="mb-6 text-sm text-[color:var(--frame)]">
        {q ? `"${q}" の検索結果` : '検索キーワードを入力してください'}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articlesWithEndpoint.map(({ article, endpoint }) => (
          <ArticleCard key={article.id} article={article} endpoint={endpoint} />
        ))}
      </div>
    </div>
  )
}
