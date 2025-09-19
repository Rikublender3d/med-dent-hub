import { createClient } from 'microcms-js-sdk'
import { ArticleResponse, Article } from '@/types/microcms'

// CI環境では環境変数がないため、ダミー値で初期化
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || 'dummy'
const apiKey = process.env.MICROCMS_API_KEY || 'dummy'

export const client = createClient({
  serviceDomain,
  apiKey,
})

export const getArticles = async () => {
  // CI環境や環境変数がない場合はモックデータを返す
  if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 10
    } as ArticleResponse
  }
  
  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
  })
  return data
}

export const getArticleById = async (id: string) => {
  // CI環境や環境変数がない場合はモックデータを返す
  if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
    return {
      id,
      title: 'Sample Article',
      content: 'This is a sample article for CI/CD testing.',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Article
  }
  
  const data = await client.get<Article>({
    endpoint: 'articles',
    contentId: id,
  })
  return data
}
