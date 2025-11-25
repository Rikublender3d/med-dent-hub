import { createClient } from 'microcms-js-sdk'
import {
  ArticleResponse,
  Article,
  CategoryResponse,
  TagResponse,
} from '@/types/microcms'

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

export const getArticles = async (params?: {
  q?: string
  limit?: number
  offset?: number
  categoryId?: string
  tagId?: string
}) => {
  const filters: string[] = []
  if (params?.categoryId) {
    filters.push(`category[equals]${params.categoryId}`)
  }
  if (params?.tagId) {
    filters.push(`tags[contains]${params.tagId}`)
  }

  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
    queries: {
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
      filters: filters.length > 0 ? filters.join('[and]') : undefined,
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

export const getArticlesByIds = async (ids: string[]) => {
  if (!ids.length) return []

  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
    queries: {
      ids: ids.join(','),
      limit: ids.length,
    },
  })

  return data.contents
}

export const getFeaturedArticles = async (limit = 6) => {
  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
    queries: {
      filters: 'isFeatured[equals]true',
      orders: '-publishedAt',
      limit,
    },
  })

  return data
}

export const getTags = async () => {
  const data = await client.get<TagResponse>({
    endpoint: 'tags',
    queries: { limit: 100, fields: ['id', 'name'] as unknown as string },
  })
  return data
}
