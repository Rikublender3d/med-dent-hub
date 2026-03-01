import { BetaAnalyticsDataClient } from '@google-analytics/data'

// ============================================================
// GA4 Data API — 人気記事IDをPV順で取得
// ============================================================
//
// 必要な環境変数:
//   GA4_PROPERTY_ID            — GA4 プロパティID（数値）
//   GA4_SERVICE_ACCOUNT_EMAIL  — サービスアカウントのメールアドレス
//   GA4_SERVICE_ACCOUNT_KEY    — サービスアカウントの秘密鍵（JSON の private_key をそのまま）
//
// GA4 側で該当サービスアカウントに「閲覧者」ロールを付与しておくこと。

const ARTICLE_PATH_RE = /^\/(general|medical-articles)\/([^/?#]+)/

let _client: BetaAnalyticsDataClient | null = null

function getClient(): BetaAnalyticsDataClient | null {
  if (_client) return _client

  const email = process.env.GA4_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GA4_SERVICE_ACCOUNT_KEY

  if (!email || !key) return null

  _client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: email,
      private_key: key.replace(/\\n/g, '\n'),
    },
  })
  return _client
}

type PopularArticleId = {
  id: string
  endpoint: 'general' | 'medical-articles'
  screenPageViews: number
}

// インメモリキャッシュ（TTL 付き）
let cache: { data: PopularArticleId[]; expiresAt: number } | null = null
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 時間

/**
 * GA4 Data API から直近 30 日の記事別 PV を取得し、
 * PV 降順で記事IDリストを返す。
 *
 * GA4 未設定時やエラー時は空配列を返す（サイトが壊れないようにする）。
 */
export async function fetchPopularArticleIds(
  limit = 20
): Promise<PopularArticleId[]> {
  if (cache && Date.now() < cache.expiresAt) {
    return cache.data.slice(0, limit)
  }

  const propertyId = process.env.GA4_PROPERTY_ID
  const client = getClient()

  if (!propertyId || !client) {
    return []
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        orGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'pagePath',
                stringFilter: {
                  matchType: 'BEGINS_WITH',
                  value: '/general/',
                },
              },
            },
            {
              filter: {
                fieldName: 'pagePath',
                stringFilter: {
                  matchType: 'BEGINS_WITH',
                  value: '/medical-articles/',
                },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 50,
    })

    const seen = new Set<string>()
    const results: PopularArticleId[] = []

    for (const row of response.rows ?? []) {
      const path = row.dimensionValues?.[0]?.value ?? ''
      const views = Number(row.metricValues?.[0]?.value ?? '0')
      const match = ARTICLE_PATH_RE.exec(path)
      if (!match) continue

      const endpoint = match[1] as 'general' | 'medical-articles'
      const id = match[2]

      if (seen.has(id)) continue
      seen.add(id)

      results.push({ id, endpoint, screenPageViews: views })
    }

    cache = { data: results, expiresAt: Date.now() + CACHE_TTL_MS }
    return results.slice(0, limit)
  } catch (err) {
    console.warn('GA4 fetchPopularArticleIds failed:', err)
    return []
  }
}
