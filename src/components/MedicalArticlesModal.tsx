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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          <h2 className="mb-4 text-2xl font-bold text-[color:var(--foreground)]">
            医療従事者ですか？
          </h2>
          <p className="mb-6 leading-relaxed text-gray-600">
            この記事は医療従事者向けの内容が含まれています。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/general"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-[color:var(--foreground)] transition-colors hover:bg-gray-50"
            >
              いいえ
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-[color:var(--accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[color:var(--accent)]/90"
              onClick={() => {
                sessionStorage.setItem('isMedical', 'true')
                setShowModal(false)
              }}
            >
              はい
            </button>
          </div>
        </div>
      </div>
    )
  )
}
