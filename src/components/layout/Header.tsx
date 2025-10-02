'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={`rounded px-2 py-1 text-sm hover:underline ${
        isActive ? 'text-[color:var(--accent)]' : ''
      }`}
    >
      {label}
    </Link>
  )
}

export function Header() {
  return (
    <header className="border-frame/80 sticky top-0 z-30 border-b bg-[color:var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-base font-bold text-[color:var(--foreground)] sm:text-lg"
        >
          医師と歯医者の交換日記
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink href="/" label="ホーム" />
            <NavLink href="/posts" label="記事一覧" />
            <NavLink href="/search" label="検索" />
          </nav>
          <form action="/search" className="hidden items-center md:flex">
            <input
              name="q"
              placeholder="記事・症例を検索"
              className="border-frame h-9 w-56 rounded-md border bg-white px-3 text-sm text-[color:var(--foreground)] placeholder-[color:var(--frame)] focus:ring-2 focus:ring-[color:var(--accent)]/40 focus:outline-none"
            />
          </form>
        </div>
      </div>
    </header>
  )
}
