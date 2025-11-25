import { getArticles, getTags } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 60

type SearchParams = Record<string, string | string[] | undefined>

interface Props {
  searchParams: Promise<SearchParams> | SearchParams
}

function resolveParam(params: SearchParams, key: string): string | undefined {
  const value = params[key]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

export default async function PostsPage({ searchParams }: Props) {
  const resolvedParams =
    searchParams instanceof Promise ? await searchParams : searchParams

  const categoryId = resolveParam(resolvedParams, 'category')
  const tagId = resolveParam(resolvedParams, 'tag')
  const { contents } = await getArticles(
    categoryId || tagId ? { categoryId, tagId } : undefined
  )
  const tagsRes = await getTags()
  const tags = tagsRes.contents
  const sorted = [...contents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const selectedTag = tagId ? tags.find((t) => t.id === tagId) : null

  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">記事一覧</h1>
      <div className="mb-6">
        {categoryId ? (
          <p className="mb-2 text-sm text-[color:var(--frame)]">
            カテゴリー: {categoryId}
          </p>
        ) : null}
        {selectedTag ? (
          <p className="mb-2 text-sm text-[color:var(--frame)]">
            タグ: #{selectedTag.name}
          </p>
        ) : null}
        {!categoryId && !selectedTag && (
          <p className="mb-2 text-sm text-[color:var(--frame)]">新着順</p>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
