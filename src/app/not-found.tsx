import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-white">
      <div className="container mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <div className="rounded-full border border-[color:var(--frame)] px-3 py-1 text-xs text-gray-600">
          404 - Not Found
        </div>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
          お探しのページが見つかりませんでした
        </h1>
        <p className="text-gray-600">
          URL
          が変更されたか、削除された可能性があります。以下のリンクから目的のページへお戻りください。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-[color:var(--accent)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent)]/90"
          >
            ホームに戻る
          </Link>
          <Link
            href="/articles"
            className="rounded-lg border border-[color:var(--frame)] bg-white px-5 py-2 text-sm font-medium text-[color:var(--foreground)] hover:bg-gray-50"
          >
            記事一覧を見る
          </Link>
        </div>
      </div>
    </div>
  )
}
