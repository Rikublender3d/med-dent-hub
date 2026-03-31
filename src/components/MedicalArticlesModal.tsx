'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MedicalArticlesModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const alreadyAnswered = sessionStorage.getItem('isMedical')
    if (!alreadyAnswered) {
      setShowModal(true)
    }
  }, [])

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* ヘッダーバー */}
          <div className="bg-[color:var(--accent)] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">
                医療従事者向け情報
              </h2>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="px-6 py-6">
            <p className="mb-6 text-[0.9375rem] leading-relaxed text-gray-600">
              本ページのコンテンツは医療従事者の方を対象としており、一般の方への情報提供を目的としたものではありません。
            </p>
            <p className="mb-6 text-base font-semibold text-[color:var(--foreground)]">
              あなたは医療従事者ですか？
            </p>
            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] px-6 py-3.5 font-bold text-white transition-all hover:shadow-lg hover:shadow-[color:var(--accent)]/25"
                onClick={() => {
                  sessionStorage.setItem('isMedical', 'true')
                  setShowModal(false)
                }}
              >
                はい
              </button>
              <Link
                href="/"
                className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-6 py-3.5 font-bold text-gray-500 transition-all hover:bg-gray-100"
              >
                いいえ
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
