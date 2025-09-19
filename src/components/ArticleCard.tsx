import Link from 'next/link'
import { Article } from '@/types/microcms'

interface Props {
  article: Article
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <article className="rounded-lg bg-white p-6 shadow-md">
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
    </article>
  )
}
