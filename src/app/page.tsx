import {
  getArticles,
  getFeaturedArticles,
  getPopularArticles,
  getTags,
} from '@/lib/microCMS/microcms'
import { ArticleCard } from '@/components/ArticleCard'
import { ABHero } from '@/components/ABHero'
import NewsletterBanner from '@/components/NewsletterBanner'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export default async function Home() {
  // general 系廃止のため getFeaturedArticles(5, 'general') は呼び出さない
  const [allArticlesRes, tagsRes, medicalFeaturedRes, popularFromIds] =
    await Promise.all([
      getArticles(),
      getTags(),
      // getFeaturedArticles(5, 'general'),
      getFeaturedArticles(5, 'medical-articles'),
      getPopularArticles(9),
    ])

  const allContents = allArticlesRes.contents
  const tags = tagsRes.contents
  const sortedByNewest = [...allContents].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // 人気記事: GA4 PV順。取得できない場合は最新9件でフォールバック
  const popularArticles =
    popularFromIds.length > 0 ? popularFromIds : sortedByNewest.slice(0, 6)

  // const featuredArticles = featuredRes.contents
  const medicalFeaturedArticles = medicalFeaturedRes.contents

  const popularArticlesWithEndpoint = popularArticles.map((article) => ({
    article,
    endpoint: article.endpoint,
  }))
  const newestArticlesWithEndpoint = sortedByNewest
    .slice(0, 6)
    .map((article) => ({
      article,
      endpoint: article.endpoint,
    }))

  // カルーセル用: 人気記事から eyecatch がある記事を最大5件
  const carouselArticles = popularArticles.filter((a) => a.eyecatch).slice(0, 5)

  return (
    <div className="min-h-screen bg-white">
      {/* ━━ Hero セクション: A/B 分岐（クライアントサイドでランダム） ━━ */}
      <ABHero
        carouselArticles={carouselArticles}
        heroA={
          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left: Main Message */}
                <div className="flex flex-col justify-center">
                  <h1 className="mb-6 text-4xl leading-tight font-bold text-[color:var(--foreground)] lg:text-5xl">
                    医療の明日を、
                    <br />
                    現場からよくする
                  </h1>
                  <p className="mb-8 text-lg leading-relaxed text-gray-600">
                    医者と歯医者の交換日記は、医科歯科連携にまつわるお役立ち情報をお届けし、
                    「医療の明日を、現場からよくする」ための一歩を後押しするメディアです。
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
                  >
                    サイトについて
                  </Link>
                </div>

                {/* Right: Featured Articles */}
                <div className="relative">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100">
                    <div className="relative aspect-square lg:aspect-[5/4]">
                      <Image
                        src="/med-dent-hub.webp"
                        alt="医療と歯科の連携"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
        heroCompact={
          <section className="bg-white py-8">
            <div className="container mx-auto px-4 lg:px-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h1 className="mb-6 text-4xl leading-[60px] font-bold text-[color:var(--foreground)] lg:text-4xl">
                    医療の明日を、
                    <br />
                    現場からよくする
                  </h1>
                  <p className="mb-8 max-w-[708px] text-lg leading-[29px] text-gray-600">
                    医者と歯医者の交換日記は、医科歯科連携にまつわるお役立ち情報をお届けし、
                    「医療の明日を、現場からよくする」ための一歩を後押しするメディアです。
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
                  >
                    サイトについて
                  </Link>
                </div>
                <div className="w-full shrink-0 lg:w-[454px]">
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="relative aspect-[5/4]">
                      <Image
                        src="/med-dent-hub.webp"
                        alt="医療と歯科の連携"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 454px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      />

      {/* Latest Articles - 新着記事 */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[color:var(--accent)]" />
            <h2 className="text-2xl font-bold text-[color:var(--foreground)]">
              新着記事
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newestArticlesWithEndpoint.map(({ article, endpoint }) => (
              <ArticleCard
                key={article.id}
                article={article}
                endpoint={endpoint}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/medical-articles"
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--accent)]/20 bg-white px-6 py-3 text-sm font-medium text-[color:var(--accent)] transition-all hover:border-[color:var(--accent)] hover:shadow-sm"
            >
              もっと見る
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Keywords - 話題のキーワード */}
      {tags.length > 0 && (
        <section className="bg-[#f8f9fb] py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-[color:var(--accent)]" />
              <h2 className="text-2xl font-bold text-[color:var(--foreground)]">
                話題のキーワード
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${tag.id}`}
                  className="inline-block rounded-full bg-gradient-to-r from-[color:var(--accent)]/10 to-[color:var(--accent)]/5 px-6 py-3 text-sm font-medium text-[color:var(--foreground)] transition-all hover:from-[color:var(--accent)]/20 hover:to-[color:var(--accent)]/10 hover:shadow-md"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Articles - 人気の記事 */}
      {popularArticles.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-[color:var(--accent)]" />
              <h2 className="text-2xl font-bold text-[color:var(--foreground)]">
                人気の記事
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularArticlesWithEndpoint.map(({ article, endpoint }) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  endpoint={endpoint}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/medical-articles"
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
              >
                もっと見る
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles - おすすめ記事 */}
      {medicalFeaturedArticles.length > 0 && (
        <section className="bg-[#f8f9fb] py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-[color:var(--accent)]" />
              <h2 className="text-2xl font-bold text-[color:var(--foreground)]">
                おすすめ記事
              </h2>
            </div>

            {/* 一般向けセクションは general 系廃止により無効化 */}
            {/*
            {featuredArticles.length > 0 && (
              <div className="mb-12">
                <h3 className="mb-6 text-xl font-bold text-[color:var(--foreground)]">
                  一般の方向け
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredArticles.slice(0, 9).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      endpoint="general"
                    />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/general"
                    className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
                  >
                    もっと見る
                  </Link>
                </div>
              </div>
            )}
            */}

            {/* 医療従事者向け */}
            {medicalFeaturedArticles.length > 0 && (
              <div>
                <h3 className="mb-6 text-xl font-bold text-[color:var(--foreground)]">
                  医療従事者向け
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {medicalFeaturedArticles.slice(0, 9).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      endpoint="medical-articles"
                    />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/medical-articles"
                    className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 py-3 text-white transition-colors hover:bg-[color:var(--accent)]/90"
                  >
                    もっと見る
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter Floating Banner */}
      <NewsletterBanner />
    </div>
  )
}
