import {
  getDraftArticle,
  getSidebarData,
  getArticlesByIds,
} from '@/lib/microCMS/microcms'
import type { Endpoint } from '@/types/microcms'
import type { Tag } from '@/types/microcms'
import Image from 'next/image'
import Link from 'next/link'
import { SafeHTML } from '@/components/SafeHTML'
import { ArticleCard } from '@/components/ArticleCard'
import { TableOfContents } from '@/components/TableOfContents'
import { ArticleSidebar } from '@/components/ArticleSidebar'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const VALID_ENDPOINTS: Endpoint[] = ['general', 'medical-articles']

interface Props {
  params: Promise<{ id: string }> | { id: string }
  searchParams:
    | Promise<{ draftKey?: string; endpoint?: string }>
    | { draftKey?: string; endpoint?: string }
}

export default async function DraftPage({ params, searchParams }: Props) {
  const resolvedParams = params instanceof Promise ? await params : params
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : searchParams

  const { id } = resolvedParams
  const { draftKey, endpoint } = resolvedSearchParams

  // draftKey と endpoint が必須（プレビューURL例: /draft/xxx?draftKey=yyy&endpoint=general）
  if (
    !draftKey ||
    !endpoint ||
    !VALID_ENDPOINTS.includes(endpoint as Endpoint)
  ) {
    notFound()
  }

  const endpointTyped = endpoint as Endpoint

  try {
    const [article, sidebarData] = await Promise.all([
      getDraftArticle(id, draftKey, endpointTyped),
      getSidebarData(5),
    ])

    const relatedArticles = article.relatedarticles || []
    const relatedIds = relatedArticles.map((a) => a.id)
    const relatedFetched =
      relatedIds.length > 0 ? await getArticlesByIds(relatedIds) : []
    const relatedArticlesWithEndpoint = relatedFetched.map((article) => ({
      article,
      endpoint: article.endpoint,
    }))

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

        <div className="mx-auto max-w-7xl py-8">
          {/* 記事ヘッダー（画像より上） */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {article.category && (
                <Link
                  href={`/articles?category=${article.category.id}`}
                  className="inline-block rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--accent)]/20"
                >
                  {article.category.name}
                </Link>
              )}
              {article.tags && article.tags.length > 0 && (
                <>
                  {article.tags.map((tag: Tag) => (
                    <Link
                      key={tag.id}
                      href={`/articles?tag=${tag.id}`}
                      className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      #{tag.name}
                    </Link>
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

          {/* メインコンテンツとサイドバー */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
            {/* メインコンテンツ */}
            <article className="lg:col-span-7">
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

              {/* ソーシャルシェア */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  シェア:
                </span>
                <div className="flex gap-2">
                  <a
                    href={`https://x.com/intent/tweet?url=${encodeURIComponent(`https://www.ishatohaisha.com/draft/${article.id}?draftKey=${draftKey}`)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
                    aria-label="X（旧Twitter）でシェア"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.ishatohaisha.com/draft/${article.id}?draftKey=${draftKey}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                    aria-label="Facebookでシェア"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://www.ishatohaisha.com/draft/${article.id}?draftKey=${draftKey}`)}&title=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                    aria-label="LinkedInでシェア"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* 関連記事 */}
              {relatedArticlesWithEndpoint.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 text-2xl font-bold text-[color:var(--foreground)]">
                    関連記事
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {relatedArticlesWithEndpoint.map(
                      ({ article, endpoint }) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          endpoint={endpoint}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* CTA セクション */}
              <div className="mt-12 rounded-2xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent)]/90 p-8 text-center text-white">
                <h2 className="mb-4 text-2xl font-bold">
                  医療の未来を一緒に創りませんか？
                </h2>
                <p className="mb-6 text-lg opacity-90">
                  医師と歯科医師の連携を通じて、より良い医療を実現するために
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/articles"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[color:var(--accent)] transition-colors hover:bg-gray-100"
                  >
                    他の記事を読む
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-[color:var(--accent)]"
                  >
                    サイトについて
                  </Link>
                </div>
              </div>
            </article>

            {/* サイドバー */}
            <ArticleSidebar sidebarData={sidebarData} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('❌ 下書き記事の取得に失敗しました:', error)
    notFound()
  }
}
