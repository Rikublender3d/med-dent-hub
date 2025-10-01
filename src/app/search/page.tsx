import { getArticles } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 30

interface Props {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? '').trim()
  const { contents } = await getArticles(q ? { q, limit: 50 } : { limit: 24 })

  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">検索</h1>
      <p className="mb-6 text-sm text-[color:var(--frame)]">{q ? `“${q}” の検索結果` : '検索キーワードを入力してください'}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}


