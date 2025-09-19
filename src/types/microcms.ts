export interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface ArticleResponse {
  contents: Article[]
  totalCount: number
  offset: number
  limit: number
}
