import { getArticleById } from '@/lib/microCMS/microcms'
import Image from 'next/image'
import { SafeHTML } from '@/components/SafeHTML'

interface Props {
  params: { id: string }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const article = await getArticleById(id)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        {article.eyecatch && (
          <Image
            src={article.eyecatch.url}
            alt={article.title}
            className="mb-6 aspect-video w-full rounded-lg bg-slate-50 object-cover shadow-md"
            width={1200}
            height={640}
          />
        )}
        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
        <time className="mb-8 block text-gray-600">
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </time>
        {/* DOMPurifyでサニタイズされたHTMLコンテンツ */}
        <SafeHTML html={article.content} className="prose max-w-none" />
      </article>
    </div>
  )
}
