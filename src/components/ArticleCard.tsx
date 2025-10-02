import Link from 'next/link'
import { Article } from '@/types/microcms'
import Image from 'next/image'

interface Props {
  article: Article
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-md">
      {article.eyecatch && (
        <div className="relative h-48 w-full">
          <Image
            src={article.eyecatch.url}
            alt={article.title}
            fill
            className="rounded-lg object-cover shadow-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="mb-2 text-xl font-semibold">{article.title}</h2>
        <p className="text-sm text-gray-600">
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </p>
        <Link
          href={`/articles/${article.id}`}
          className="text-blue-600 hover:underline"
        >
          続きを読む →
        </Link>
      </div>
    </article>
  )
}
