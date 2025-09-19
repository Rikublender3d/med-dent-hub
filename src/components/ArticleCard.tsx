import Link from 'next/link'
import { Article } from '@/types/microcms'

interface Props {
  article: Article
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <article className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
      <p className="text-gray-600 text-sm">
        {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
      </p>
      <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
        続きを読む →
      </Link>
    </article>
  )
}