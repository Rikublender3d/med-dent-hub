'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { ArticleWithEndpoint } from '@/types/microcms'

interface HeroCarouselProps {
  articles: ArticleWithEndpoint[]
}

const INTERVAL = 5000
const SWIPE_THRESHOLD = 50

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.96,
  }),
}

export function HeroCarousel({ articles }: HeroCarouselProps) {
  const [[current, direction], setCurrent] = useState([0, 0])
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const count = articles.length

  const paginate = useCallback(
    (dir: number) => {
      setCurrent(([prev]) => [(prev + dir + count) % count, dir])
    },
    [count]
  )

  // 自動スライド
  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => paginate(1), INTERVAL)
    return () => clearInterval(timer)
  }, [count, paginate])

  if (!articles.length) return null

  const article = articles[current]

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* カルーセル本体 */}
        <div
          className="relative overflow-hidden rounded-2xl bg-[color:var(--foreground)]"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart === null) return
            const diff = touchStart - e.changedTouches[0].clientX
            if (Math.abs(diff) > SWIPE_THRESHOLD) {
              paginate(diff > 0 ? 1 : -1)
            }
            setTouchStart(null)
          }}
        >
          {/* メインスライド */}
          <div className="relative aspect-[4/3] md:aspect-[2/1] lg:aspect-[21/9]">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'tween', duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                  opacity: { duration: 0.35 },
                  scale: { duration: 0.5 },
                }}
                className="absolute inset-0"
              >
                <Link
                  href={`/${article.endpoint}/${article.id}`}
                  className="group block h-full w-full"
                >
                  {/* 記事画像 */}
                  {article.eyecatch ? (
                    <Image
                      src={article.eyecatch.url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      priority={current === 0}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent)]/70" />
                  )}

                  {/* グラデーションオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* テキストコンテンツ */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-10">
                    <div className="max-w-3xl">
                      {article.category && (
                        <span className="mb-2 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm md:mb-3 md:text-sm">
                          {article.category.name}
                        </span>
                      )}
                      <h2
                        className="mb-2 text-lg leading-snug font-bold text-white md:text-2xl lg:text-3xl"
                        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
                      >
                        {article.title}
                      </h2>
                      <time className="text-xs text-white/60 md:text-sm">
                        {new Date(article.publishedAt).toLocaleDateString(
                          'ja-JP'
                        )}
                      </time>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 左右矢印 — デスクトップのみ */}
          {count > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute top-1/2 left-3 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 md:flex"
                aria-label="前のスライド"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute top-1/2 right-3 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 md:flex"
                aria-label="次のスライド"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* ドットインジケーター */}
          {count > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:bottom-5">
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent([i, i > current ? 1 : -1])}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-5 bg-white'
                      : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`スライド${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
