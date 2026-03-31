import { redirect } from 'next/navigation'

// generalページ廃止のためリダイレクト対応
// 元のコードは以下の通り：

/*
import { Suspense } from 'react'
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

function resolveArrayParam(
  params: SearchParams,
  key: string
): string[] | undefined {
  const value = params[key]
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string')
  }
  if (typeof value === 'string') {
    return [value]
  }
  return undefined
}

export default async function ArticlesPage({ searchParams }: Props) {
  const resolvedParams =
    searchParams instanceof Promise ? await searchParams : searchParams

  const categoryId = resolveParam(resolvedParams, 'category')
  const tagIds = resolveArrayParam(resolvedParams, 'tag')

  const { contents } = await getArticles(
    categoryId || tagIds
      ? {
          endpoint: 'general',
          categoryId,
          tagIds: tagIds && tagIds.length > 0 ? tagIds : undefined,
        }
      : { endpoint: 'general' }
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
          一般向け記事一覧
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="mb-8 lg:hidden">
              <Suspense
                fallback={
                  <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
                }
              >
                <FilterSidebar
                  basePath="/general"
                  categories={categories}
                  tags={tags}
                  selectedCategoryId={categoryId}
                  selectedTagIds={tagIds}
                />
              </Suspense>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {sorted.length}件の記事が見つかりました
              </p>
            </div>
            {sorted.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sorted.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    endpoint="general"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-12 text-center">
                <p className="text-gray-600">
                  該当する記事が見つかりませんでした。
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-sm text-[color:var(--accent)] hover:underline"
                >
                  ホームに戻る
                </Link>
              </div>
            )}
          </div>

          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24">
              <Suspense
                fallback={
                  <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
                }
              >
                <FilterSidebar
                  basePath="/general"
                  categories={categories}
                  tags={tags}
                  selectedCategoryId={categoryId}
                  selectedTagIds={tagIds}
                />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
*/

export default function GeneralPage() {
  redirect('/')
}
