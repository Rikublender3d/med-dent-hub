import Link from 'next/link'
import { Article } from '@/types/microcms'
import Image from 'next/image'

interface Props {
  article: Article
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <article className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg h-full">
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
          <h2 className="mb-3 text-lg font-semibold leading-tight text-[color:var(--foreground)] line-clamp-2">
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
