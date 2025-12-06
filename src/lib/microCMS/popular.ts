const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN!
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY!
const POPULAR_ENDPOINT = 'popular-articles'

/**
 * microCMSに人気記事IDを書き込む
 * @param articleIds 記事IDの配列
 */
export async function updatePopularArticles(
  articleIds: string[]
): Promise<void> {
  try {
    const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${POPULAR_ENDPOINT}`

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
      },
      body: JSON.stringify({
        articles: articleIds,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`microCMS更新失敗: ${response.status} - ${error}`)
    }

    console.log(`✅ microCMSに${articleIds.length}件の人気記事を保存`)
  } catch (error) {
    console.error('❌ microCMS更新エラー:', error)
    throw error
  }
}

/**
 * microCMSから人気記事IDを取得
 * @returns 記事IDの配列
 */
export async function getPopularArticleIds(): Promise<string[]> {
  try {
    const url = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${POPULAR_ENDPOINT}`

    const response = await fetch(url, {
      headers: {
        'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
      },
    })

    if (!response.ok) {
      console.log('⚠️  microCMSから人気記事が取得できませんでした')
      return []
    }

    const data = await response.json()

    // 複数コンテンツ参照の場合、articlesは記事オブジェクトの配列
    if (Array.isArray(data.articles)) {
      return data.articles.map((article: { id: string }) => article.id)
    }

    return []
  } catch (error) {
    console.error('❌ microCMS取得エラー:', error)
    return []
  }
}
