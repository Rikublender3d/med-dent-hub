'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavLink({ href, label, hasDropdown }: { href: string; label: string; hasDropdown?: boolean }) {
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
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-[color:var(--foreground)]">
            医師と歯医者の交換日記
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/" label="ホーム" />
          <NavLink href="/posts" label="記事一覧" hasDropdown />
          <NavLink href="/categories" label="カテゴリー" hasDropdown />
          <NavLink href="/case-studies" label="症例研究" hasDropdown />
          <NavLink href="/about" label="サイトについて" />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-gray-200 md:block">
            お役立ち資料
          </button>
          <button className="hidden rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-gray-200 md:block">
            メルマガ登録
          </button>
          <Link href="/search" className="rounded-md p-2 text-[color:var(--foreground)] hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
