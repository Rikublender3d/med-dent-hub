"use client"

import { useEffect } from 'react'
import { trackArticleView } from './GoogleAnalytics'

interface Props {
  articleId: string
  articleTitle: string
}

export function ArticleViewTracker({ articleId, articleTitle }: Props) {
  useEffect(() => {
    // Track article view on mount
    trackArticleView(articleId, articleTitle)
  }, [articleId, articleTitle])

  return null
}
