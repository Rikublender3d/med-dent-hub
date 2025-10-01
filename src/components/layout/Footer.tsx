export function Footer() {
  return (
    <footer className="mt-12 border-t border-frame/80">
      <div className="container mx-auto px-4 py-8 text-xs text-[color:var(--frame)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} 医師と歯医者の交換日記</p>
          <div className="flex items-center gap-4">
            <a href="/about" className="hover:underline">
              このサイトについて
            </a>
            <a href="/privacy" className="hover:underline">
              プライバシー
            </a>
            <a href="/contact" className="hover:underline">
              お問い合わせ
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}


