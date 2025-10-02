import { createClient } from 'microcms-js-sdk'
import { ArticleResponse, Article, CategoryResponse } from '@/types/microcms'

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

export const getArticles = async (params?: {
  q?: string
  limit?: number
  offset?: number
  categoryId?: string
}) => {
  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
    queries: {
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
      filters: params?.categoryId
        ? `category[equals]${params.categoryId}`
        : undefined,
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

export const getCategories = async () => {
  const data = await client.get<CategoryResponse>({
    endpoint: 'categories',
    queries: { limit: 50, fields: ['id', 'name'] as unknown as string },
  })
  return data
}
