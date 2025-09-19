import { getArticleById } from '@/lib/microCMS/microcms'

interface Props {
  params: { id: string }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const article = await getArticleById(id)

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
        <time className="mb-8 block text-gray-600">
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
