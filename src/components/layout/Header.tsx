'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function NavLink({
  href,
  label,
  hasDropdown,
}: {
  href: string
  label: string
  hasDropdown?: boolean
}) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
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
  const panelRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-2">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <div className="h-16 w-auto">
            <Image
              src="/2.png"
              alt="医師と歯医者の交換日記"
              width={160}
              height={64}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-4 hidden flex-shrink-0 items-center gap-6 lg:flex">
          <NavLink href="/" label="ホーム" />
          <NavLink href="/posts" label="記事一覧" />
          <NavLink href="/about" label="サイトについて" />
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
          <button
            type="button"
            aria-label="メニューを開閉"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className="rounded-md p-2 text-[color:var(--foreground)] hover:bg-gray-100"
          >
            <span className="sr-only">メニュー</span>
            <div className="relative h-5 w-6">
              <span
                className={`absolute top-0 left-0 block h-0.5 w-6 bg-current transition-transform duration-300 ease-in-out ${
                  isOpen ? 'translate-y-2.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute top-2.5 left-0 block h-0.5 w-6 bg-current transition-opacity duration-200 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 block h-0.5 w-6 bg-current transition-transform duration-300 ease-in-out ${
                  isOpen ? '-translate-y-2.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Desktop action */}
        <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
          <button className="hidden rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-gray-200 xl:block">
            メルマガ登録
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="border-t border-gray-100 bg-white lg:hidden"
        >
          <div className="container mx-auto px-6 py-4">
            <nav className="mb-3 grid gap-1">
              <NavLink href="/" label="ホーム" />
              <NavLink href="/posts" label="記事一覧" />
              <NavLink href="/about" label="サイトについて" />
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
