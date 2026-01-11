import { MetadataRoute } from 'next'
import { getArticles } from '@/lib/microCMS/microcms'

export const revalidate = 3600 // 1時間ごとに再生成

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ishatohaisha.com'

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // 記事ページを取得
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const { contents } = await getArticles()
    articlePages = contents.map((article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('❌ 記事の取得に失敗しました:', error)
  }

  return [...staticPages, ...articlePages]
}
