export interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  eyecatch: {
    url: string
  }
}

export interface ArticleResponse {
  contents: Article[]
  totalCount: number
  offset: number
  limit: number
}

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CategoryResponse {
  contents: Category[]
  totalCount: number
  offset: number
  limit: number
}
