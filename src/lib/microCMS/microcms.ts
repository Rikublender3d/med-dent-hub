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
  tagIds?: string[]
  isFeatured?: boolean
}) => {
  const filters: string[] = []
  if (params?.categoryId) {
    filters.push(`category[equals]${params.categoryId}`)
  }
  // 複数タグ対応（tagIdsが優先）
  if (params?.tagIds && params.tagIds.length > 0) {
    // 複数のタグをAND条件でフィルタリング
    params.tagIds.forEach((tagId) => {
      filters.push(`tags[contains]${tagId}`)
    })
  } else if (params?.tagId) {
    // 後方互換性のため、単一タグもサポート
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
    queries: {
      depth: 2, // 関連記事も取得するためにdepthを指定
    },
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

/**
 * 下書き記事を取得（プレビュー用）
 * @param id 記事ID
 * @param draftKey 下書きキー
 * @returns 下書き記事データ
 */
export const getDraftArticle = async (id: string, draftKey: string) => {
  const data = await client.get<Article>({
    endpoint: 'articles',
    contentId: id,
    queries: {
      draftKey,
      depth: 2, // 関連記事も取得するためにdepthを指定
    },
  })
  return data
}
