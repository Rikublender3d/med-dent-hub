import { getDraftArticle } from '@/lib/microCMS/microcms'
import type { Tag } from '@/types/microcms'
import Image from 'next/image'
import { SafeHTML } from '@/components/SafeHTML'
import { TableOfContents } from '@/components/TableOfContents'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }> | { id: string }
  searchParams: Promise<{ draftKey?: string }> | { draftKey?: string }
}

export default async function DraftPage({ params, searchParams }: Props) {
  const resolvedParams = params instanceof Promise ? await params : params
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : searchParams

  const { id } = resolvedParams
  const { draftKey } = resolvedSearchParams

  // draftKeyが必須
  if (!draftKey) {
    notFound()
  }

  try {
    // 下書き記事を取得
    const article = await getDraftArticle(id, draftKey)

    return (
      <div className="min-h-screen bg-white">
        {/* 下書きプレビューバナー */}
        <div className="border-b-2 border-yellow-400 bg-yellow-100 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="font-semibold">下書きプレビュー</span>
              <span className="text-sm">このページは下書き状態の記事です</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 記事ヘッダー */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {article.category && (
                <span className="inline-block rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--accent)]">
                  {article.category.name}
                </span>
              )}
              {article.tags && article.tags.length > 0 && (
                <>
                  {article.tags.map((tag: Tag) => (
                    <span
                      key={tag.id}
                      className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </>
              )}
            </div>
            <h1 className="mb-4 text-4xl leading-tight font-bold text-[color:var(--foreground)]">
              {article.title}
            </h1>
            {article.publishedAt && (
              <time className="text-gray-600">
                {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </time>
            )}
          </div>

          {/* ヒーロー画像セクション */}
          {article.eyecatch && (
            <div className="mb-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
                <Image
                  src={article.eyecatch.url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          )}

          {/* 目次 */}
          <div className="mb-8">
            <TableOfContents html={article.content} />
          </div>

          {/* メインコンテンツ */}
          <article>
            {/* 記事本文 */}
            <div className="prose prose-lg max-w-none">
              <SafeHTML html={article.content} />
            </div>

            {/* 著者情報セクション */}
            <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-300">
                  <div className="flex h-full w-full items-center justify-center text-2xl text-gray-600">
                    👨‍⚕️
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-[color:var(--foreground)]">
                    編集部
                  </h3>
                  <p className="text-sm text-gray-600">
                    医者と歯医者の交換日記編集部です。医科歯科連携に関する最新情報や実践的なノウハウをお届けしています。
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error('❌ 下書き記事の取得に失敗しました:', error)
    notFound()
  }
}
