'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface SearchBarTag {
  id: string
  name: string
}

interface SearchBarProps {
  tags?: SearchBarTag[]
  /** SP用: タグを常時表示（ドロップダウンなし） */
  alwaysShowTags?: boolean
}

export function SearchBar({
  tags = [],
  alwaysShowTags = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 外側クリックで閉じる
  useEffect(() => {
    if (!isFocused) return
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isFocused])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setIsFocused(false)
    inputRef.current?.blur()
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            name="q"
            placeholder="記事を検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-[color:var(--foreground)] placeholder-gray-400 transition-all focus:border-[color:var(--accent)] focus:bg-white focus:shadow-sm focus:ring-2 focus:ring-[color:var(--accent)]/15 focus:outline-none"
          />
        </div>
      </form>

      {/* alwaysShowTags: タグを常時表示（SP用） */}
      {alwaysShowTags && tags.length > 0 && (
        <div className="mt-3">
          <span className="mb-2 block text-[0.6875rem] font-bold tracking-wider text-gray-400 uppercase">
            タグから探す
          </span>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/articles?tag=${tag.id}`}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* フォーカス時にドロップダウンでタグ表示（デスクトップ用） */}
      {!alwaysShowTags && (
        <AnimatePresence>
          {isFocused && tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl bg-white p-3 shadow-lg ring-1 ring-gray-100"
            >
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false)
                    inputRef.current?.blur()
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                  }}
                  className="mb-3 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-50"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-[color:var(--accent)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-[color:var(--foreground)]">
                    &ldquo;
                    <span className="font-semibold">{query.trim()}</span>
                    &rdquo; で検索
                  </span>
                </button>
              )}
              <span className="mb-2 block px-1 text-[0.6875rem] font-bold tracking-wider text-gray-400 uppercase">
                タグから探す
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/articles?tag=${tag.id}`}
                    onClick={() => setIsFocused(false)}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
