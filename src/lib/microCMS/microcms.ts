import { createClient } from 'microcms-js-sdk'
import { ArticleResponse, Article } from '@/types/microcms'

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

export const getArticles = async () => {
  const data = await client.get<ArticleResponse>({
    endpoint: 'articles',
  })
  return data
}

export const getArticleById = async (id: string) => {
  const data = await client.get<Article>({
    endpoint: 'articles',
    contentId: id,
  })
  return data
}
