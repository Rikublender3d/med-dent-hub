'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function NavLink({ href, label, hasDropdown }: { href: string; label: string; hasDropdown?: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${isActive
        ? 'text-[color:var(--accent)]'
        : 'text-[color:var(--foreground)] hover:text-[color:var(--accent)]'
        }`}
    >
      {label}
      {hasDropdown && (
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </Link>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center gap-6 px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
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

        {/* Navigation */}
        <nav className="hidden items-center gap-6 lg:flex flex-shrink-0">
          <NavLink href="/" label="ホーム" />
          <NavLink href="/posts" label="記事一覧" hasDropdown />
          <NavLink href="/categories" label="カテゴリー" hasDropdown />
          <NavLink href="/about" label="サイトについて" />
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:block flex-1 max-w-xs">
          <form action="/search" method="get" className="relative">
            <input
              type="text"
              name="q"
              placeholder="記事を検索..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-9 text-sm text-[color:var(--foreground)] placeholder-gray-500 focus:border-[color:var(--accent)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-[color:var(--accent)] focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="hidden rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-gray-200 xl:block">
            メルマガ登録
          </button>
          {/* Mobile search button */}
          <Link href="/search" className="rounded-md p-2 text-[color:var(--foreground)] hover:bg-gray-100 lg:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
