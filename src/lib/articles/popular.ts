import { fetchPopularArticleIds } from '@/lib/analytics/googleAnalytics'
import { getArticlesByIds } from '@/lib/microCMS/microcms'
import type { Article } from '@/types/microcms'

export const getPopularArticles = async (limit = 5): Promise<Article[]> => {
  try {
    const popularIds = await fetchPopularArticleIds(limit)

    if (!popularIds.length) {
      return []
    }

    const articles = await getArticlesByIds(popularIds)
    if (!articles.length) {
      return []
    }

    const articleMap = new Map(articles.map((article) => [article.id, article]))
    const orderedArticles = popularIds
      .map((id) => articleMap.get(id))
      .filter(Boolean) as Article[]

    return orderedArticles.slice(0, limit)
  } catch (error) {
    console.error(
      'Failed to fetch popular articles from Google Analytics:',
      error
    )
    return []
  }
}
