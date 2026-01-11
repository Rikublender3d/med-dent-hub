import { fetchPopularArticleIds } from '@/lib/analytics/googleAnalytics'
import { getArticlesByIds } from '@/lib/microCMS/microcms'
import type { Article } from '@/types/microcms'

/**
 * 人気記事を取得（Google Analyticsから直接取得）
 * @param limit 取得件数
 * @returns 記事の配列
 */
export const getPopularArticles = async (limit = 5): Promise<Article[]> => {
  try {
    // Google Analyticsから人気記事IDを取得
    const popularIds = await fetchPopularArticleIds(limit)

    if (!popularIds.length) {
      return []
    }

    // 記事IDから記事データを取得
    const articles = await getArticlesByIds(popularIds)
    if (!articles.length) {
      return []
    }

    // 順序を保持したまま記事データを返す
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

/**
 * 人気記事を取得し、不足分を最新記事で補完
 * @param popularArticles 人気記事の配列
 * @param allArticles 全ての記事の配列（最新順にソート済み）
 * @param limit 最終的な取得件数
 * @returns 人気記事 + フォールバック記事の配列
 */
export const getPopularArticlesWithFallback = (
  popularArticles: Article[],
  allArticles: Article[],
  limit = 5
): Article[] => {
  // 人気記事に含まれていない最新記事をフォールバックとして追加
  const fallbackArticles = allArticles.filter(
    (article) => !popularArticles.some((popular) => popular.id === article.id)
  )

  return [...popularArticles, ...fallbackArticles].slice(0, limit)
}
