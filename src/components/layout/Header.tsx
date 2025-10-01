import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-frame/80 bg-[color:var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-[color:var(--foreground)]">
          医師と歯医者の交換日記
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:underline">
            新着
          </Link>
          <Link href="/posts" className="hover:underline">
            記事一覧
          </Link>
          <Link href="/search" className="hover:underline">
            検索
          </Link>
        </nav>
      </div>
    </header>
  )
}


