import { getArticles, getCategories, getTags } from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'
import FilterSidebar from '@/components/FilterSidebar'
import Link from 'next/link'

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
  const [categoriesRes, tagsRes] = await Promise.all([
    getCategories(),
    getTags(),
  ])
  const categories = categoriesRes.contents
  const tags = tagsRes.contents
  const sorted = [...contents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-2xl font-bold text-[color:var(--foreground)]">
          記事一覧
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            {/* SP版: 絞り込みフィルター（上部） */}
            <div className="mb-8 lg:hidden">
              <FilterSidebar
                categories={categories}
                tags={tags}
                selectedCategoryId={categoryId}
                selectedTagId={tagId}
              />
            </div>

            {/* 記事一覧 */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {sorted.length}件の記事が見つかりました
              </p>
            </div>
            {sorted.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sorted.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-12 text-center">
                <p className="text-gray-600">
                  該当する記事が見つかりませんでした。
                </p>
                <Link
                  href="/posts"
                  className="mt-4 inline-block text-sm text-[color:var(--accent)] hover:underline"
                >
                  すべての記事を見る
                </Link>
              </div>
            )}
          </div>

          {/* PC版: サイドバー */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar
                categories={categories}
                tags={tags}
                selectedCategoryId={categoryId}
                selectedTagId={tagId}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
