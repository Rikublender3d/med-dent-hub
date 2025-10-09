import Link from 'next/link'
import { Article } from '@/types/microcms'
import Image from 'next/image'

interface Props {
  article: Article
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg">
      {article.eyecatch && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.eyecatch.url}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="mb-3 text-lg font-semibold leading-tight text-[color:var(--foreground)] line-clamp-2">
          {article.title}
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </p>
        <Link
          href={`/articles/${article.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--accent)] hover:underline"
        >
          続きを読む
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
