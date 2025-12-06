import { BetaAnalyticsDataClient } from '@google-analytics/data'

const propertyId = process.env.GA4_PROPERTY_ID || process.env.GA_PROPERTY_ID
const clientEmail = process.env.GA_CLIENT_EMAIL
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')

let analyticsClient: BetaAnalyticsDataClient | null = null

export interface ArticleAnalytics {
  articleId: string
  pageViews: number
  uniquePageViews?: number
  averageTimeOnPage?: number
  bounceRate?: number
}

export interface DateRange {
  startDate: string
  endDate: string
}

function hasValidCredentials() {
  return Boolean(propertyId && clientEmail && privateKey)
}

function getAnalyticsClient() {
  if (!hasValidCredentials()) {
    return null
  }

  if (!analyticsClient) {
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })
  }

  return analyticsClient
}

/**
 * 人気記事のIDを取得
 * @param limit 取得する記事数
 * @param dateRange 日付範囲（オプション、デフォルトは過去30日）
 * @returns 記事IDの配列
 */
export const fetchPopularArticleIds = async (
  limit = 10,
  dateRange: DateRange = {
    startDate: '8daysAgo',
    endDate: '1daysAgo',
  }
): Promise<string[]> => {
  if (!hasValidCredentials()) {
    console.warn(
      '⚠️  Google Analytics credentials are not fully configured. Please set GA4_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY.'
    )
    return []
  }

  if (limit <= 0) {
    return []
  }

  const client = getAnalyticsClient()
  if (!client) {
    return []
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'BEGINS_WITH',
            value: '/articles/',
          },
        },
      },
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit,
    })

    if (!response.rows || response.rows.length === 0) {
      console.log('⚠️  GA4からデータが取得できませんでした')
      return []
    }

    // パスから記事IDを抽出
    const articleIds = response.rows
      .map((row) => {
        const path = row.dimensionValues?.[0]?.value || ''
        // /articles/[id] から [id] を抽出
        const match = path.match(/^\/articles\/([^/?]+)/)
        return match ? match[1] : null
      })
      .filter((id): id is string => id !== null)

    // 重複を削除
    const uniqueIds = Array.from(new Set(articleIds))

    console.log(`✅ GA4から${uniqueIds.length}件の人気記事を取得`)
    return uniqueIds
  } catch (error) {
    console.error('❌ GA4取得エラー:', error)
    return []
  }
}

/**
 * 記事の詳細な分析データを取得
 * @param limit 取得する記事数
 * @param dateRange 日付範囲（オプション、デフォルトは過去30日）
 * @returns 記事の分析データの配列
 */
export const fetchArticleAnalytics = async (
  limit = 5,
  dateRange?: DateRange
): Promise<ArticleAnalytics[]> => {
  if (!hasValidCredentials()) {
    console.warn(
      'Google Analytics credentials are not fully configured. Please set GA_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY.'
    )
    return []
  }

  if (limit <= 0) {
    return []
  }

  const client = getAnalyticsClient()
  if (!client) {
    return []
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        dateRange || {
          startDate: '30daysAgo',
          endDate: 'yesterday',
        },
      ],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'BEGINS_WITH',
            value: '/articles/',
          },
        },
      },
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: limit * 3,
    })

    const analytics: ArticleAnalytics[] = []
    const seenIds = new Set<string>()

    response.rows?.forEach((row) => {
      const path = row.dimensionValues?.[0]?.value ?? ''
      if (!path) return

      const segments = path.split('/')
      const rawId = segments[2]?.split('?')[0]

      if (!rawId || seenIds.has(rawId)) return

      const pageViews = parseInt(row.metricValues?.[0]?.value || '0', 10)
      const uniquePageViews = parseInt(row.metricValues?.[1]?.value || '0', 10)
      const avgTime = parseFloat(row.metricValues?.[2]?.value || '0')
      const bounceRate = parseFloat(row.metricValues?.[3]?.value || '0')

      analytics.push({
        articleId: rawId,
        pageViews,
        uniquePageViews,
        averageTimeOnPage: avgTime,
        bounceRate: bounceRate / 100, // パーセンテージを小数に変換
      })

      seenIds.add(rawId)
    })

    return analytics.slice(0, limit)
  } catch (error) {
    console.error(
      'Error fetching article analytics from Google Analytics:',
      error
    )
    return []
  }
}

/**
 * 特定の記事の分析データを取得
 * @param articleId 記事ID
 * @param dateRange 日付範囲（オプション、デフォルトは過去30日）
 * @returns 記事の分析データ
 */
export const fetchArticleAnalyticsById = async (
  articleId: string,
  dateRange?: DateRange
): Promise<ArticleAnalytics | null> => {
  if (!hasValidCredentials()) {
    console.warn(
      'Google Analytics credentials are not fully configured. Please set GA_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY.'
    )
    return null
  }

  const client = getAnalyticsClient()
  if (!client) {
    return null
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        dateRange || {
          startDate: '30daysAgo',
          endDate: 'yesterday',
        },
      ],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: `/articles/${articleId}`,
          },
        },
      },
      limit: 1,
    })

    const row = response.rows?.[0]
    if (!row) {
      return null
    }

    const pageViews = parseInt(row.metricValues?.[0]?.value || '0', 10)
    const uniquePageViews = parseInt(row.metricValues?.[1]?.value || '0', 10)
    const avgTime = parseFloat(row.metricValues?.[2]?.value || '0')
    const bounceRate = parseFloat(row.metricValues?.[3]?.value || '0')

    return {
      articleId,
      pageViews,
      uniquePageViews,
      averageTimeOnPage: avgTime,
      bounceRate: bounceRate / 100,
    }
  } catch (error) {
    console.error(
      `Error fetching analytics for article ${articleId} from Google Analytics:`,
      error
    )
    return null
  }
}
