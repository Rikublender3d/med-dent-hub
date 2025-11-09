import { BetaAnalyticsDataClient } from '@google-analytics/data'

const propertyId = process.env.GA_PROPERTY_ID
const clientEmail = process.env.GA_CLIENT_EMAIL
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')

let analyticsClient: BetaAnalyticsDataClient | null = null

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

export const fetchPopularArticleIds = async (limit = 5): Promise<string[]> => {
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

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '30daysAgo',
        endDate: 'yesterday',
      },
    ],
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
    limit: limit * 3,
  })

  const articleIds: string[] = []

  response.rows?.forEach((row) => {
    const path = row.dimensionValues?.[0]?.value ?? ''
    if (!path) return

    const segments = path.split('/')
    const rawId = segments[2]?.split('?')[0]

    if (rawId && !articleIds.includes(rawId)) {
      articleIds.push(rawId)
    }
  })

  return articleIds.slice(0, limit)
}
