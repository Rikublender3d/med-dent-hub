import Link from 'next/link'
import { Article } from '@/types/microcms'
import Image from 'next/image'

interface Props {
  article: Article
  basePath?: string
}

export const ArticleCard = ({ article, basePath = '/general' }: Props) => {
  return (
    <Link href={`${basePath}/${article.id}`} className="block">
      <article className="group h-full overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg">
        {article.eyecatch && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={article.eyecatch.url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          {/* カテゴリとタグ */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {article.category && (
              <span className="inline-block rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-xs font-medium text-[color:var(--accent)]">
                {article.category.name}
              </span>
            )}
            {article.tags && article.tags.length > 0 && (
              <>
                {article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    #{tag.name}
                  </span>
                ))}
              </>
            )}
          </div>
          <h2 className="mb-3 line-clamp-2 text-lg leading-tight font-semibold text-[color:var(--foreground)]">
            {article.title}
          </h2>
          <p className="text-sm text-gray-600">
            {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </article>
    </Link>
  )
}
