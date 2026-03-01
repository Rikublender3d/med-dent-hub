'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'

const STORAGE_KEY = 'newsletter-banner-dismissed'

export default function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // セッション中に閉じていたら表示しない
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <>
      {/* ━━ デスクトップ: フローティングカード ━━ */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed right-6 bottom-6 z-50 hidden w-[340px] md:block"
          >
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] shadow-2xl shadow-blue-900/25">
              {/* ジオメトリック装飾 */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/[0.04]" />
                <div className="absolute right-16 bottom-10 h-2 w-2 rounded-full bg-white/20" />
                <div className="absolute top-6 left-1/4 h-1.5 w-1.5 rounded-full bg-white/15" />
              </div>

              <div className="relative px-6 py-6">
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
                  aria-label="閉じる"
                >
                  <IoClose className="h-4 w-4" />
                </button>

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>

                <h3 className="mb-1.5 text-lg font-bold text-white">
                  医科歯科連携マニュアル
                </h3>
                <p className="mb-5 text-[0.8125rem] leading-relaxed text-white/70">
                  現場で使える実践ガイドを無料でお届け
                </p>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[0.8125rem] font-semibold text-[color:var(--accent)] transition-all hover:gap-3 hover:shadow-lg"
                >
                  無料ダウンロード
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━ SP: スリムバー ━━ */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed right-0 bottom-0 left-0 z-50 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-4 py-3 shadow-lg shadow-blue-900/20">
              <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-bold text-white">
                医科歯科連携マニュアル
              </span>
              <Link
                href="/newsletter"
                className="flex-shrink-0 rounded-md bg-white px-3.5 py-1.5 text-xs font-bold text-[color:var(--accent)]"
              >
                無料DL
              </Link>
              <button
                onClick={handleClose}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white/80"
                aria-label="閉じる"
              >
                <IoClose className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
