import {
  getArticleById,
  getArticles,
  getCategories,
} from '@/lib/microCMS/microcms'
import Image from 'next/image'
import Link from 'next/link'
import { SafeHTML } from '@/components/SafeHTML'
import { ArticleCard } from '@/components/ArticleCard'
import { TableOfContents } from '@/components/TableOfContents'
import ArticleAnalytics from '@/components/ArticleAnalytics'

interface Props {
  params: { id: string }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const [article, { contents: allArticles }, categoriesRes] = await Promise.all(
    [getArticleById(id), getArticles(), getCategories()]
  )

  const categories = categoriesRes.contents
  const sortedByNewest = [...allArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // 関連記事（同じカテゴリーの記事、最大3件）
  const relatedArticles = article.category
    ? sortedByNewest
      .filter(
        (a) => a.id !== article.id && a.category?.id === article.category?.id
      )
      .slice(0, 3)
    : sortedByNewest.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <ArticleAnalytics
          id={article.id}
          path={`/articles/${article.id}`}
          title={article.title}
        />
        {/* 記事ヘッダー（画像より上） */}
        <div className="mb-8">
          {article.category && (
            <div className="mb-4">
              <Link
                href={`/posts?category=${article.category.id}`}
                className="inline-block rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--accent)] hover:bg-[color:var(--accent)]/20"
              >
                {article.category.name}
              </Link>
            </div>
          )}
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* メインコンテンツ */}
          <article className="lg:col-span-3">
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
              <span className="text-sm font-medium text-gray-600">シェア:</span>
              <div className="flex gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </button>
              </div>
            </div>

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
                  href="/posts"
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

            {/* 関連記事 */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-[color:var(--foreground)]">
                  関連記事
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((relatedArticle) => (
                    <ArticleCard
                      key={relatedArticle.id}
                      article={relatedArticle}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* サイドバー */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* プロモーションバナー */}
              <div className="rounded-xl bg-[color:var(--accent)] p-6 text-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">メルマガ登録</h3>
                <p className="mb-4 text-sm opacity-90">
                  最新の医療情報をメールでお届け
                </p>
                <Link
                  href="/about"
                  className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-[color:var(--accent)] hover:bg-gray-100"
                >
                  登録する
                </Link>
              </div>

              {/* 最新記事 */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                  最新記事
                </h3>
                <ul className="space-y-4">
                  {sortedByNewest.slice(0, 5).map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/articles/${article.id}`}
                        className="block rounded-lg p-3 hover:bg-gray-50"
                      >
                        <h4 className="mb-1 line-clamp-2 text-sm font-medium text-[color:var(--foreground)]">
                          {article.title}
                        </h4>
                        <time className="text-xs text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString(
                            'ja-JP'
                          )}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* カテゴリー */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                  カテゴリー
                </h3>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/posts?category=${category.id}`}
                        className="block rounded-lg p-2 text-sm hover:bg-gray-50"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 人気記事 */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                  人気記事（注目）
                </h3>
                <ul className="space-y-4">
                  {sortedByNewest.slice(0, 3).map((article, index) => (
                    <li key={article.id} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent)] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <Link
                        href={`/articles/${article.id}`}
                        className="line-clamp-2 text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)]"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ソーシャルメディア */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
                  フォローする
                </h3>
                <div className="flex gap-3">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-700">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
