'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { SearchBar } from '@/components/SearchBar'

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
      suppressHydrationWarning
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

interface HeaderProps {
  tags?: { id: string; name: string }[]
}

export function Header({ tags = [] }: HeaderProps) {
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
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-2 md:px-6">
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
                  href="/medical-articles"
                  onClick={() => setIsArticlesDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-gray-50 hover:text-[color:var(--accent)]"
                >
                  医療従事者向け
                </Link>
                <Link
                  href="/general"
                  onClick={() => setIsArticlesDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-gray-50 hover:text-[color:var(--accent)]"
                >
                  一般向け
                </Link>
              </div>
            )}
          </div>
          <NavLink href="/about" label="サイトについて" />
        </nav>

        {/* Desktop Search Bar */}
        <div className="mx-8 hidden max-w-lg flex-1 lg:block">
          <SearchBar tags={tags} />
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
            医科歯科連携マニュアルDL
          </Link>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-[color:var(--frame)] bg-white shadow-lg lg:hidden"
        >
          <div className="container mx-auto px-4 py-3">
            {/* ナビゲーション — 最小44pxタップターゲット */}
            <nav>
              <Link
                href="/"
                onClick={() => setTimeout(() => setIsOpen(false), 30)}
                className="flex min-h-[44px] items-center border-b border-[color:var(--frame)] px-2 text-[15px] font-medium text-[color:var(--foreground)] active:bg-gray-50"
              >
                ホーム
              </Link>

              {/* 記事一覧 */}
              <div className="border-b border-[color:var(--frame)]">
                <span className="flex min-h-[44px] items-center px-2 text-[15px] font-medium text-[color:var(--foreground)]">
                  記事一覧
                </span>
                <div className="mb-2 ml-4 border-l-2 border-[color:var(--accent)]/25">
                  <Link
                    href="/medical-articles"
                    onClick={() => setTimeout(() => setIsOpen(false), 30)}
                    className="flex min-h-[44px] items-center px-4 text-sm text-gray-500 active:bg-gray-50 active:text-[color:var(--accent)]"
                  >
                    医療従事者向け
                  </Link>
                  <Link
                    href="/general"
                    onClick={() => setTimeout(() => setIsOpen(false), 30)}
                    className="flex min-h-[44px] items-center px-4 text-sm text-gray-500 active:bg-gray-50 active:text-[color:var(--accent)]"
                  >
                    一般向け
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                onClick={() => setTimeout(() => setIsOpen(false), 30)}
                className="flex min-h-[44px] items-center border-b border-[color:var(--frame)] px-2 text-[15px] font-medium text-[color:var(--foreground)] active:bg-gray-50"
              >
                サイトについて
              </Link>
            </nav>

            {/* 検索 + タグ常時表示 */}
            <div className="pt-4 pb-3">
              <SearchBar tags={tags} alwaysShowTags />
            </div>

            {/* CTA */}
            <div className="border-t border-[color:var(--frame)] pt-4 pb-1">
              <Link
                href="/newsletter"
                onClick={() => setTimeout(() => setIsOpen(false), 30)}
                className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[color:var(--accent)] text-sm font-medium text-white active:bg-[color:var(--accent)]/85"
              >
                医科歯科連携マニュアルDL
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
