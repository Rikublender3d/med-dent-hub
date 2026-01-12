'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'

function NavLink({
  href,
  label,
  hasDropdown,
  onClick,
}: {
  href: string
  label: string
  hasDropdown?: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'text-[color:var(--accent)]'
          : 'text-[color:var(--foreground)] hover:text-[color:var(--accent)]'
      }`}
    >
      {label}
      {hasDropdown && (
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </Link>
  )
}

export function Header() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isArticlesDropdownOpen, setIsArticlesDropdownOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const isShift = e.shiftKey
        const active = document.activeElement as HTMLElement | null
        if (!active) return
        if (!isShift && active === last) {
          e.preventDefault()
          first.focus()
        } else if (isShift && active === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  // ドロップダウンの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsArticlesDropdownOpen(false)
      }
    }

    if (isArticlesDropdownOpen) {
      // 少し遅延させて、ボタンクリックイベントが先に処理されるようにする
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isArticlesDropdownOpen])

  return (
    <header className="relative sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-2">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <div className="h-16 w-auto">
            <Image
              src="/2.png"
              alt="医者と歯医者の交換日記"
              width={160}
              height={64}
              className="h-full w-auto object-contain"
              style={{ width: 'auto', height: '100%' }}
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-4 hidden flex-shrink-0 items-center gap-6 lg:flex">
          <NavLink href="/" label="ホーム" />
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsArticlesDropdownOpen(!isArticlesDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:text-[color:var(--accent)]"
            >
              記事一覧
              <svg
                className={`h-3 w-3 transition-transform ${
                  isArticlesDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isArticlesDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <Link
                  href="/general"
                  onClick={() => setIsArticlesDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-gray-50 hover:text-[color:var(--accent)]"
                >
                  一般向け
                </Link>
                <Link
                  href="/medical-articles"
                  onClick={() => setIsArticlesDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-gray-50 hover:text-[color:var(--accent)]"
                >
                  医療従事者向け
                </Link>
              </div>
            )}
          </div>
          <NavLink href="/about" label="サイトについて" />
          <NavLink href="/newsletter" label="メルマガ" />
        </nav>

        {/* Desktop Search Bar */}
        <div className="mx-8 hidden max-w-lg flex-1 lg:block">
          <form
            action="/search"
            method="get"
            className="relative"
            onSubmit={(e) => {
              if (!query.trim()) {
                e.preventDefault()
              }
            }}
          >
            <input
              type="text"
              name="q"
              placeholder="記事を検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-9 text-sm text-[color:var(--foreground)] placeholder-gray-500 focus:border-[color:var(--accent)] focus:bg-white focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-[color:var(--accent)] focus:outline-none"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Actions / Mobile toggles */}
        <div className="flex flex-shrink-0 items-center gap-2 lg:hidden">
          {/* Hamburger */}
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </div>

        {/* Desktop action */}
        <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/newsletter"
            className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 xl:block"
          >
            メルマガ登録
          </Link>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-gray-100 bg-white lg:hidden"
        >
          <div className="container mx-auto px-6 py-4">
            <nav className="mb-3 grid gap-1">
              <NavLink
                href="/"
                label="ホーム"
                onClick={() => setTimeout(() => setIsOpen(false), 30)}
              />
              <div className="px-3 py-2">
                <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">
                  記事一覧
                </div>
                <div className="ml-2 flex flex-col gap-1">
                  <Link
                    href="/general"
                    onClick={() => setTimeout(() => setIsOpen(false), 30)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-[color:var(--accent)]"
                  >
                    一般向け
                  </Link>
                  <Link
                    href="/medical-articles"
                    onClick={() => setTimeout(() => setIsOpen(false), 30)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-[color:var(--accent)]"
                  >
                    医療従事者向け
                  </Link>
                </div>
              </div>
              <NavLink
                href="/about"
                label="サイトについて"
                onClick={() => setTimeout(() => setIsOpen(false), 30)}
              />
              <NavLink
                href="/newsletter"
                label="メルマガ"
                onClick={() => setTimeout(() => setIsOpen(false), 30)}
              />
            </nav>
            <form
              action="/search"
              method="get"
              className="relative"
              onSubmit={(e) => {
                if (!query.trim()) {
                  e.preventDefault()
                }
              }}
            >
              <input
                type="text"
                name="q"
                placeholder="記事を検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-9 text-sm text-[color:var(--foreground)] placeholder-gray-500 focus:border-[color:var(--accent)] focus:bg-white focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-[color:var(--accent)] focus:outline-none"
              >
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
