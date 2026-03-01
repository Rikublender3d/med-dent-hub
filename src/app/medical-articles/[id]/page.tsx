import {
  getArticleById,
  getDraftArticle,
  getSidebarData,
  getArticlesByIds,
} from '@/lib/microCMS/microcms'
import Image from 'next/image'
import Link from 'next/link'
import { SafeHTML } from '@/components/SafeHTML'
import { ArticleCard } from '@/components/ArticleCard'
import { TableOfContents } from '@/components/TableOfContents'
import { ArticleSidebar } from '@/components/ArticleSidebar'
import AuthorInfo from '@/components/AuthorInfo'
import ShareButtons from '@/components/ShareButtons'
import MedicalArticlesModal from '@/components/MedicalArticlesModal'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }> | { id: string }
  searchParams?: Promise<{ draftKey?: string }> | { draftKey?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await (params instanceof Promise
    ? params
    : Promise.resolve(params))

  try {
    const article = await getArticleById(id, 'medical-articles')

    return {
      title: article.title,
      description: article.description || '医者と歯医者の交換日記',
      openGraph: {
        title: article.title,
        description: article.description || '医者と歯医者の交換日記',
        type: 'article',
        publishedTime: article.publishedAt,
        images: article.eyecatch
          ? [
              {
                url: article.eyecatch.url,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.description || '医者と歯医者の交換日記',
        images: article.eyecatch ? [article.eyecatch.url] : undefined,
      },
    }
  } catch {
    return {
      title: '記事が見つかりません',
      description: '医者と歯医者の交換日記',
    }
  }
}

export default async function MedicalArticlePage({
  params,
  searchParams,
}: Props) {
  const { id } = await (params instanceof Promise
    ? params
    : Promise.resolve(params))
  const resolvedSearch = searchParams
    ? await (searchParams instanceof Promise
        ? searchParams
        : Promise.resolve(searchParams))
    : {}
  const draftKey = resolvedSearch.draftKey

  try {
    const [article, sidebarData] = await Promise.all([
      draftKey
        ? getDraftArticle(id, draftKey, 'medical-articles')
        : getArticleById(id, 'medical-articles'),
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
        {draftKey && (
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
                <span className="text-sm">
                  このページは下書き状態の記事です
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-7xl py-8">
          {/* 記事ヘッダー（画像より上） */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {article.category && (
                <Link
                  href={`/medical-articles?category=${article.category.id}`}
                  className="inline-block rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--accent)]/20"
                >
                  {article.category.name}
                </Link>
              )}
              {article.tags && article.tags.length > 0 && (
                <>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/medical-articles?tag=${tag.id}`}
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
            <time className="text-gray-600">
              {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
            </time>
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
              <AuthorInfo author={article.author} />

              <ShareButtons
                url={`https://www.ishatohaisha.com/medical-articles/${article.id}`}
                title={article.title}
              />
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
                    href="/medical-articles"
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
            <ArticleSidebar
              sidebarData={sidebarData}
              basePath="/medical-articles"
            />
          </div>
        </div>
        <MedicalArticlesModal />
      </div>
    )
  } catch (error) {
    console.error('❌ 記事の取得に失敗しました:', error)
    notFound()
  }
}
