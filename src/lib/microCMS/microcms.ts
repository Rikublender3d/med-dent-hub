import { createClient } from 'microcms-js-sdk'
import {
  ArticleResponse,
  Article,
  ArticleWithEndpoint,
  Endpoint,
  CategoryResponse,
  TagResponse,
} from '@/types/microcms'

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

export const getGeneralArticles = async (params?: {
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
    endpoint: 'general',
    queries: {
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
      filters: filters.length > 0 ? filters.join('[and]') : undefined,
    },
  })
  return data
}

export const getGeneralArticleById = async (id: string) => {
  const data = await client.get<Article>({
    endpoint: 'general',
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

export const getGeneralArticlesByIds = async (ids: string[]) => {
  if (!ids.length) return []

  const data = await client.get<ArticleResponse>({
    endpoint: 'general',
    queries: {
      ids: ids.join(','),
      limit: ids.length,
    },
  })

  return data.contents
}

export const getMedicalArticlesByIds = async (ids: string[]) => {
  if (!ids.length) return []

  const data = await client.get<ArticleResponse>({
    endpoint: 'medical-articles',
    queries: {
      ids: ids.join(','),
      limit: ids.length,
    },
  })

  return data.contents
}

/**
 * 複数IDの endpoint を一括取得（2リクエストで済む）
 */
export const getEndpointsForIds = async (
  ids: string[]
): Promise<Map<string, Endpoint>> => {
  if (!ids.length) return new Map()
  const [general, medical] = await Promise.all([
    getGeneralArticlesByIds(ids),
    getMedicalArticlesByIds(ids),
  ])
  const map = new Map<string, Endpoint>()
  general.forEach((a) => map.set(a.id, 'general'))
  medical.forEach((a) => map.set(a.id, 'medical-articles'))
  return map
}

/**
 * 記事IDからendpointを判定（単体用。複数は getEndpointsForIds を使うこと）
 */
export const getEndpointByArticleId = async (id: string): Promise<Endpoint> => {
  const map = await getEndpointsForIds([id])
  return map.get(id) ?? 'medical-articles'
}

/**
 * 両方のエンドポイントから記事IDで取得（endpoint 付き）
 */
export const getAllArticlesByIds = async (
  ids: string[]
): Promise<ArticleWithEndpoint[]> => {
  if (!ids.length) return []

  const [articles, medicalArticles] = await Promise.all([
    getGeneralArticlesByIds(ids),
    getMedicalArticlesByIds(ids),
  ])

  const articleMap = new Map<string, ArticleWithEndpoint>()
  articles.forEach((a) => articleMap.set(a.id, { ...a, endpoint: 'general' }))
  medicalArticles.forEach((a) =>
    articleMap.set(a.id, { ...a, endpoint: 'medical-articles' })
  )
  return ids
    .map((id) => articleMap.get(id))
    .filter((a): a is ArticleWithEndpoint => Boolean(a))
}

export const getFeaturedArticles = async (limit = 6) => {
  const data = await client.get<ArticleResponse>({
    endpoint: 'general',
    queries: {
      filters: 'isFeatured[equals]true',
      orders: '-publishedAt',
      limit,
    },
  })
  const contentsWithEndpoint: ArticleWithEndpoint[] = data.contents.map(
    (c) => ({
      ...c,
      endpoint: 'general' as const,
    })
  )
  return { ...data, contents: contentsWithEndpoint }
}

export const getMedicalFeaturedArticles = async (limit = 6) => {
  const data = await client.get<ArticleResponse>({
    endpoint: 'medical-articles',
    queries: {
      filters: 'isFeatured[equals]true',
      orders: '-publishedAt',
      limit,
    },
  })
  const contentsWithEndpoint: ArticleWithEndpoint[] = data.contents.map(
    (c) => ({
      ...c,
      endpoint: 'medical-articles' as const,
    })
  )
  return { ...data, contents: contentsWithEndpoint }
}

export const getTags = async () => {
  const data = await client.get<TagResponse>({
    endpoint: 'tags',
    queries: { limit: 100, fields: ['id', 'name'] as unknown as string },
  })
  return data
}

/**
 * generalとmedical-articlesの両方から取得して統合（endpoint 付き）
 */
export const getArticles = async (params?: {
  q?: string
  limit?: number
  offset?: number
  categoryId?: string
  tagId?: string
  tagIds?: string[]
  isFeatured?: boolean
}) => {
  const [articlesRes, medicalArticlesRes] = await Promise.all([
    getGeneralArticles(params),
    getMedicalArticles(params),
  ])

  const generalWithEndpoint: ArticleWithEndpoint[] = articlesRes.contents.map(
    (c) => ({ ...c, endpoint: 'general' as const })
  )
  const medicalWithEndpoint: ArticleWithEndpoint[] =
    medicalArticlesRes.contents.map((c) => ({
      ...c,
      endpoint: 'medical-articles' as const,
    }))
  const sorted = [...generalWithEndpoint, ...medicalWithEndpoint].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return {
    contents: sorted,
    totalCount: articlesRes.totalCount + medicalArticlesRes.totalCount,
    limit: articlesRes.limit,
    offset: articlesRes.offset,
  }
}

// Medical Articles (医療従事者向け)
export const getMedicalArticles = async (params?: {
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
    endpoint: 'medical-articles',
    queries: {
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
      filters: filters.length > 0 ? filters.join('[and]') : undefined,
    },
  })
  return data
}

export const getMedicalArticleById = async (id: string) => {
  const data = await client.get<Article>({
    endpoint: 'medical-articles',
    contentId: id,
    queries: {
      depth: 2, // 関連記事も取得するためにdepthを指定
    },
  })
  return data
}

export const getDraftMedicalArticle = async (id: string, draftKey: string) => {
  const data = await client.get<Article>({
    endpoint: 'medical-articles',
    contentId: id,
    queries: {
      draftKey,
      depth: 2,
    },
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
  // まずgeneralエンドポイントで試す
  try {
    const data = await client.get<Article>({
      endpoint: 'general',
      contentId: id,
      queries: {
        draftKey,
        depth: 2, // 関連記事も取得するためにdepthを指定
      },
    })
    return data
  } catch {
    // generalで見つからない場合はmedical-articlesで試す
    const data = await client.get<Article>({
      endpoint: 'medical-articles',
      contentId: id,
      queries: {
        draftKey,
        depth: 2, // 関連記事も取得するためにdepthを指定
      },
    })
    return data
  }
}
