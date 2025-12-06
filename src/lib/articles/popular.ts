import { fetchPopularArticleIds } from '@/lib/analytics/googleAnalytics'
import { getArticlesByIds } from '@/lib/microCMS/microcms'
import { getPopularArticleIds } from '@/lib/microCMS/popular'
import type { Article } from '@/types/microcms'

/**
 * 人気記事を取得（microCMS優先、フォールバックでGoogle Analytics）
 * @param limit 取得件数
 * @returns 記事の配列
 */
export const getPopularArticles = async (limit = 5): Promise<Article[]> => {
  try {
    // 1. まずmicroCMSから取得を試みる
    let popularIds = await getPopularArticleIds()

    // 2. microCMSにデータがない場合は、Google Analyticsから取得（フォールバック）
    if (!popularIds.length) {
      console.log(
        '📊 microCMSにデータがないため、Google Analyticsから取得します'
      )
      popularIds = await fetchPopularArticleIds(limit)
    }

    if (!popularIds.length) {
      return []
    }

    // 3. 記事IDから記事データを取得
    const articles = await getArticlesByIds(popularIds)
    if (!articles.length) {
      return []
    }

    // 4. 順序を保持したまま記事データを返す
    const articleMap = new Map(articles.map((article) => [article.id, article]))
    const orderedArticles = popularIds
      .map((id) => articleMap.get(id))
      .filter(Boolean) as Article[]

    return orderedArticles.slice(0, limit)
  } catch (error) {
    console.error('❌ 人気記事の取得に失敗しました:', error)
    return []
  }
}
