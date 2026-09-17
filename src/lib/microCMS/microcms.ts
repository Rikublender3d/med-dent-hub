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

/**
 * microCMS の部分一致条件（contains / not_contains）で指定できる
 * 検索文字列の上限（2026-08-05 の仕様変更で導入）。
 * 上限を超えると API が 400 Bad Request を返すため、
 * 事前に弾いてリクエスト全体が失敗しないようにする。
 * 文字数は microCMS と同様に URL デコード後の UTF-16 コード単位で数える
 * （一部の漢字・絵文字は見た目より多く数えられる）。
 * @see https://document.microcms.io/content-api/get-list-contents
 */
const PARTIAL_MATCH_MAX_LENGTH = 2000

/**
 * 部分一致条件に使える文字列か（上限内か）を判定。
 * tags の値は URL クエリ由来でユーザーが操作できるため、
 * 不正に長い値を API に渡さないよう防御的にチェックする。
 */
function isWithinPartialMatchLimit(value: string): boolean {
  return value.length <= PARTIAL_MATCH_MAX_LENGTH
}

function buildFilters(params?: ArticleListParams): string | undefined {
  const filters: string[] = []

  if (params?.categoryId) {
    filters.push(`category[equals]${params.categoryId}`)
  }
  const tagIds =
    params?.tagIds && params.tagIds.length > 0
      ? params.tagIds
      : params?.tagId
        ? [params.tagId]
        : []
  tagIds.filter(isWithinPartialMatchLimit).forEach((tagId) => {
    filters.push(`tags[contains]${tagId}`)
  })
  if (params?.isFeatured) {
    filters.push('isFeatured[equals]true')
  }

  return filters.length > 0 ? filters.join('[and]') : undefined
}

/**
 * microCMS の 1 リクエストあたりの取得上限（2023-10-02 以降に作成された
 * サービスで有効化）。101 件以上は offset をずらして分割取得する必要がある。
 * @see https://help.microcms.io/ja/knowledge/get-over-100-contents
 */
const MICROCMS_MAX_LIMIT = 100

/**
 * ページング時の最大リクエスト回数（暴走防止）。
 * MICROCMS_MAX_LIMIT * MAX_PAGES 件までしか取得しない。
 */
const MAX_PAGES = 20

/**
 * 記事一覧を取得。
 * limit 省略時は「全件」を意味し、100 件ずつページングして totalCount まで取得する。
 * （microCMS の limit 既定値は 10 なので、省略したまま渡すと 10 件で打ち切られる）
 * limit 指定時はその件数になるまで（必要なら複数回に分けて）取得する。
 *
 * SDK の client.getAllContents() は全件取得専用で totalCount を返さず、
 * ページ間に 1 秒の待機を挟む実装のため、任意件数の取得と
 * totalCount が必要な本関数では公式ドキュメントの「独自実装」方式を採る。
 * @see https://help.microcms.io/ja/knowledge/get-over-100-contents
 */
async function fetchFromEndpoint(
  endpoint: Endpoint,
  params?: ArticleListParams
): Promise<ArticleResponse> {
  const baseOffset = params?.offset ?? 0
  const desired = params?.limit
  const filters = buildFilters(params)

  const contents: Article[] = []
  let totalCount = 0

  for (let page = 0; page < MAX_PAGES; page++) {
    const remaining =
      desired === undefined
        ? MICROCMS_MAX_LIMIT
        : Math.min(MICROCMS_MAX_LIMIT, desired - contents.length)
    if (remaining <= 0) break

    const res = await client.get<ArticleResponse>({
      endpoint,
      queries: {
        q: params?.q,
        limit: remaining,
        offset: baseOffset + contents.length,
        filters,
        orders: '-publishedAt',
      },
    })

    totalCount = res.totalCount
    contents.push(...res.contents)

    // これ以上取得できない（最後のページ or 空レスポンス）
    if (res.contents.length === 0) break
    if (baseOffset + contents.length >= totalCount) break
  }

  return {
    contents,
    totalCount,
    limit: desired ?? contents.length,
    offset: baseOffset,
  }
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
 * - endpoint 省略時: medical-articles のみ（general は廃止）
 * - limit 省略時: 全件（内部で 100 件ずつページング）
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

  // general 系廃止により medical-articles のみ取得
  const medicalRes = await fetchFromEndpoint('medical-articles', rest)
  return {
    contents: withEndpoint(medicalRes.contents, 'medical-articles'),
    totalCount: medicalRes.totalCount,
    limit: medicalRes.limit,
    offset: medicalRes.offset,
  }

  // --- general + medical-articles 統合版（廃止）---
  // const [generalRes, medicalRes] = await Promise.all([
  //   fetchFromEndpoint('general', rest),
  //   fetchFromEndpoint('medical-articles', rest),
  // ])
  //
  // const merged = [
  //   ...withEndpoint(generalRes.contents, 'general'),
  //   ...withEndpoint(medicalRes.contents, 'medical-articles'),
  // ]
  //   .sort(
  //     (a, b) =>
  //       new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  //   )
  //   .slice(0, rest.limit ?? Infinity)
  //
  // return {
  //   contents: merged,
  //   totalCount: generalRes.totalCount + medicalRes.totalCount,
  //   limit: generalRes.limit,
  //   offset: generalRes.offset,
  // }
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

  // general 系廃止により medical-articles のみ取得
  const medicalRes = await client
    .get<ArticleResponse>({
      endpoint: 'medical-articles',
      queries: { ids: ids.join(','), limit: ids.length },
    })
    .catch(() => ({ contents: [] as Article[] }))

  const articleMap = new Map<string, ArticleWithEndpoint>()
  medicalRes.contents.forEach((a) =>
    articleMap.set(a.id, { ...a, endpoint: 'medical-articles' })
  )

  // --- general + medical-articles 統合版（廃止）---
  // const [generalRes, medicalRes] = await Promise.all([
  //   client
  //     .get<ArticleResponse>({
  //       endpoint: 'general',
  //       queries: { ids: ids.join(','), limit: ids.length },
  //     })
  //     .catch(() => ({ contents: [] as Article[] })),
  //   client
  //     .get<ArticleResponse>({
  //       endpoint: 'medical-articles',
  //       queries: { ids: ids.join(','), limit: ids.length },
  //     })
  //     .catch(() => ({ contents: [] as Article[] })),
  // ])
  // generalRes.contents.forEach((a) =>
  //   articleMap.set(a.id, { ...a, endpoint: 'general' })
  // )

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
