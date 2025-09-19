import { getArticleById } from '@/lib/microCMS/microcms'

interface Props {
  params: { id: string }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const article = await getArticleById(id)

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <time className="text-gray-600 block mb-8">
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </time>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  )
}
