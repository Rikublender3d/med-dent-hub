import { NextRequest, NextResponse } from 'next/server'
/** 記事のエンドポイント。path は `/${endpoint}/${id}` で組み立てる */
export type Endpoint = 'general' | 'medical-articles'

/** 文字列が Endpoint か検証 */
export function isEndpoint(s: string): s is Endpoint {
  return s === 'general' || s === 'medical-articles'
}

/** microCMS の関連記事で「ID + エンドポイント」形式にした場合の型 */
export type RelatedArticleRef = {
  id: string
  endpoint: Endpoint
}

export interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  isFeatured?: boolean
  description?: string
  eyecatch?: {
    url: string
  }
  category?: {
    id: string
    name: string
  }
  tags?: Tag[]
  relatedarticles?: (Article | RelatedArticleRef)[]
}

/** 一覧取得時に付与。path は `/${endpoint}/${id}` */
export interface ArticleWithEndpoint extends Article {
  endpoint: Endpoint
}

export interface Tag {
  id: string
  name: string
  createdAt: string
  updatedAt: string
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

export interface TagResponse {
  contents: Tag[]
  totalCount: number
  offset: number
  limit: number
}
export function middleware(request: NextRequest) {
  const referer = request.headers.get('referer')
  const origin = request.nextUrl.origin
  if (referer && referer.startsWith(origin)) {
    return new NextResponse('Unauthorized', { status: 403 })
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|pdf).*)'],
}
