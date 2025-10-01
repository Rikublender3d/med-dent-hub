import { createClient } from 'microcms-js-sdk'
import { ArticleResponse, Article } from '@/types/microcms'

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

export const getArticles = async (params?: {
  q?: string
  limit?: number
  offset?: number
}) => {
  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
    queries: {
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
    },
  })
  return data
}

export const getArticleById = async (id: string) => {
  const data = await client.get<Article>({
    endpoint: 'articles',
    contentId: id,
  })
  return data
}
