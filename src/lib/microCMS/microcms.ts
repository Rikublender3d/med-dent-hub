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
 * 記事IDからbasePathを判定する関数
 */
export const getBasePathByArticleId = async (
  id: string
): Promise<'/general' | '/medical-articles'> => {
  try {
    await getGeneralArticleById(id)
    return '/general'
  } catch {
    return '/medical-articles'
  }
}

/**
 * 両方のエンドポイントから記事IDで取得
 */
export const getAllArticlesByIds = async (
  ids: string[]
): Promise<Article[]> => {
  if (!ids.length) return []

  const [articles, medicalArticles] = await Promise.all([
    getGeneralArticlesByIds(ids),
    getMedicalArticlesByIds(ids),
  ])

  // IDの順序を保持
  const articleMap = new Map(
    [...articles, ...medicalArticles].map((article) => [article.id, article])
  )
  const orderedArticles = ids
    .map((id) => articleMap.get(id))
    .filter(Boolean) as Article[]

  return orderedArticles
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

  return data
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
 * generalとmedical-articlesの両方から取得して統合
 * 人気記事や最新記事の取得に使用
 */
export const getArticles = async (params?: {
  q?: string
  limit?: number
  offset?: number
  categoryId?: string
  tagId?: string
  tagIds?: string[]
  isFeatured?: boolean
}): Promise<ArticleResponse> => {
  const [articlesRes, medicalArticlesRes] = await Promise.all([
    getGeneralArticles(params),
    getMedicalArticles(params),
  ])

  const allContents = [...articlesRes.contents, ...medicalArticlesRes.contents]

  // 公開日時でソート
  const sorted = allContents.sort(
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
