import { getPopularArticleIds } from '@/lib/microCMS/popular'
import { getAllArticlesByIds } from '@/lib/microCMS/microcms'
import type { Article } from '@/types/microcms'

/**
 * 人気記事を取得（microCMSのpopular-articlesから取得）
 * @param limit 取得件数
 * @returns 記事の配列
 */
export const getPopularArticles = async (limit = 5): Promise<Article[]> => {
  try {
    const popularIds = await getPopularArticleIds()
    if (!popularIds.length) return []

    const articles = await getAllArticlesByIds(popularIds)
    if (!articles.length) return []

    const articleMap = new Map(articles.map((a) => [a.id, a]))
    const ordered = popularIds
      .map((id) => articleMap.get(id))
      .filter(Boolean) as Article[]

    return ordered.slice(0, limit)
  } catch (error) {
    console.error('❌ 人気記事の取得に失敗しました:', error)
    return []
  }
}

/**
 * 人気記事を取得し、不足分を最新記事で補完
 */
export const getPopularArticlesWithFallback = (
  popularArticles: Article[],
  allArticles: Article[],
  limit = 5
): Article[] => {
  const fallback = allArticles.filter(
    (a) => !popularArticles.some((p) => p.id === a.id)
  )
  return [...popularArticles, ...fallback].slice(0, limit)
}
