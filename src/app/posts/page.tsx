import { getArticles } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 60

type SearchParams = Record<string, string | string[] | undefined>

interface Props {
  searchParams: Promise<SearchParams> | SearchParams
}

function resolveCategoryId(params: SearchParams): string | undefined {
  const value = params.category
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

export default async function PostsPage({ searchParams }: Props) {
  const resolvedParams =
    searchParams instanceof Promise ? await searchParams : searchParams

  const categoryId = resolveCategoryId(resolvedParams)
  const { contents } = await getArticles(
    categoryId ? { categoryId } : undefined
  )
  const sorted = [...contents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">記事一覧</h1>
      {categoryId ? (
        <p className="mb-6 text-sm text-[color:var(--frame)]">
          カテゴリー: {categoryId}
        </p>
      ) : (
        <p className="mb-6 text-sm text-[color:var(--frame)]">新着順</p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
