import { createClient } from 'microcms-js-sdk'
import {
  ArticleResponse,
  Article,
  ArticleWithEndpoint,
  Endpoint,
  CategoryResponse,
  TagResponse,
} from '@/types/microcms'
import { fetchPopularArticleIds } from '@/lib/analytics/ga4'

// ============================================================
// Client
// ============================================================

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

// ============================================================
// Types
// ============================================================

type ArticleListParams = {
  q?: string
  limit?: number
  offset?: number
  categoryId?: string
  tagId?: string
  tagIds?: string[]
  isFeatured?: boolean
}

type GetArticlesParams = ArticleListParams & {
  /** 指定時は単一エンドポイントのみ、省略時は両方から取得 */
  endpoint?: Endpoint
}

/** サイドバー用データ */
export type SidebarData = {
  latestArticles: ArticleWithEndpoint[]
  /** 人気記事（編集部指定 or 今後GA4等で差し替え可能）。未設定時は [] */
  popularArticles: ArticleWithEndpoint[]
  categories: CategoryResponse
  tags: TagResponse
}

// ============================================================
// Internal helpers
// ============================================================

function buildFilters(params?: ArticleListParams): string | undefined {
  const filters: string[] = []

  if (params?.categoryId) {
    filters.push(`category[equals]${params.categoryId}`)
  }
  if (params?.tagIds && params.tagIds.length > 0) {
    params.tagIds.forEach((tagId) => {
      filters.push(`tags[contains]${tagId}`)
    })
  } else if (params?.tagId) {
    filters.push(`tags[contains]${params.tagId}`)
  }
  if (params?.isFeatured) {
    filters.push('isFeatured[equals]true')
  }

  return filters.length > 0 ? filters.join('[and]') : undefined
}

async function fetchFromEndpoint(
  endpoint: Endpoint,
  params?: ArticleListParams
): Promise<ArticleResponse> {
  return client.get<ArticleResponse>({
    endpoint,
    queries: {
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
      filters: buildFilters(params),
      orders: '-publishedAt',
    },
  })
}

function withEndpoint(
  contents: Article[],
  endpoint: Endpoint
): ArticleWithEndpoint[] {
  return contents.map((c) => ({ ...c, endpoint }))
}

// ============================================================
// 記事取得（統一API）
// ============================================================

/**
 * 記事一覧を取得
 * - endpoint 指定時: そのエンドポイントのみ
 * - endpoint 省略時: general + medical-articles を統合（publishedAt でソート）
 */
export async function getArticles(params?: GetArticlesParams) {
  const { endpoint, ...rest } = params ?? {}

  // 単一エンドポイント
  if (endpoint) {
    const data = await fetchFromEndpoint(endpoint, rest)
    return {
      contents: withEndpoint(data.contents, endpoint),
      totalCount: data.totalCount,
      limit: data.limit,
      offset: data.offset,
    }
  }

  // 両方から取得して統合
  const [generalRes, medicalRes] = await Promise.all([
    fetchFromEndpoint('general', rest),
    fetchFromEndpoint('medical-articles', rest),
  ])

  const merged = [
    ...withEndpoint(generalRes.contents, 'general'),
    ...withEndpoint(medicalRes.contents, 'medical-articles'),
  ]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, rest.limit ?? Infinity)

  return {
    contents: merged,
    totalCount: generalRes.totalCount + medicalRes.totalCount,
    limit: generalRes.limit,
    offset: generalRes.offset,
  }
}

/**
 * ID 指定で記事を1件取得
 * endpoint は必須（URLで分かるので呼び出し側で必ず渡す）
 */
export async function getArticleById(
  id: string,
  endpoint: Endpoint
): Promise<ArticleWithEndpoint> {
  const data = await client.get<Article>({
    endpoint,
    contentId: id,
    queries: { depth: 2 },
  })
  return { ...data, endpoint }
}

/**
 * 人気記事を GA4 の直近30日PV順で取得。
 * GA4 未設定・エラー時は空配列を返す（呼び出し側でフォールバック）。
 */
export async function getPopularArticles(
  limit = 5
): Promise<ArticleWithEndpoint[]> {
  const popular = await fetchPopularArticleIds(limit)
  if (!popular.length) return []
  const ids = popular.map((p) => p.id)
  return getArticlesByIds(ids)
}

/**
 * 複数IDの記事を取得（endpoint 付き）
 * 関連記事の表示などに使用
 */
export async function getArticlesByIds(
  ids: string[]
): Promise<ArticleWithEndpoint[]> {
  if (!ids.length) return []

  const [generalRes, medicalRes] = await Promise.all([
    client
      .get<ArticleResponse>({
        endpoint: 'general',
        queries: { ids: ids.join(','), limit: ids.length },
      })
      .catch(() => ({ contents: [] as Article[] })),
    client
      .get<ArticleResponse>({
        endpoint: 'medical-articles',
        queries: { ids: ids.join(','), limit: ids.length },
      })
      .catch(() => ({ contents: [] as Article[] })),
  ])

  const articleMap = new Map<string, ArticleWithEndpoint>()
  generalRes.contents.forEach((a) =>
    articleMap.set(a.id, { ...a, endpoint: 'general' })
  )
  medicalRes.contents.forEach((a) =>
    articleMap.set(a.id, { ...a, endpoint: 'medical-articles' })
  )

  // リクエスト順を維持
  return ids
    .map((id) => articleMap.get(id))
    .filter((a): a is ArticleWithEndpoint => Boolean(a))
}

/**
 * おすすめ記事を取得
 * - endpoint 指定時: そのエンドポイントのおすすめのみ
 * - endpoint 省略時: 両方から取得
 */
export async function getFeaturedArticles(limit = 6, endpoint?: Endpoint) {
  return getArticles({ endpoint, isFeatured: true, limit })
}

/**
 * 下書き記事を取得（プレビュー用）
 * endpoint は必須（プレビューURLに ?endpoint=general などを含める）
 */
export async function getDraftArticle(
  id: string,
  draftKey: string,
  endpoint: Endpoint
): Promise<ArticleWithEndpoint> {
  const data = await client.get<Article>({
    endpoint,
    contentId: id,
    queries: { draftKey, depth: 2 },
  })
  return { ...data, endpoint }
}

// ============================================================
// マスターデータ
// ============================================================

export async function getCategories() {
  return client.get<CategoryResponse>({
    endpoint: 'categories',
    queries: { limit: 50, fields: ['id', 'name'] as unknown as string },
  })
}

export async function getTags() {
  return client.get<TagResponse>({
    endpoint: 'tags',
    queries: { limit: 100, fields: ['id', 'name'] as unknown as string },
  })
}

// ============================================================
// サイドバー共通データ
// ============================================================

/**
 * サイドバーで使う共通データをまとめて取得
 * 記事詳細・下書きプレビューなどで使用
 */
export async function getSidebarData(
  latestLimit = 5,
  popularLimit = 5
): Promise<SidebarData> {
  const [articlesRes, popularArticles, categories, tags] = await Promise.all([
    getArticles({ limit: latestLimit }),
    getPopularArticles(popularLimit),
    getCategories(),
    getTags(),
  ])

  return {
    latestArticles: articlesRes.contents,
    popularArticles,
    categories,
    tags,
  }
}
