'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

interface Props {
  id: string
  path: string
  title?: string
}

export default function ArticleAnalytics({ id, path, title }: Props) {
  useEffect(() => {
    // セッション内の二重計測を軽減
    const key = `va_article_view_${id}`
    if (!sessionStorage.getItem(key)) {
      // もし title が undefined の場合は空文字で送信する
      track('article_view', { id, path, title: title ?? '' })
      sessionStorage.setItem(key, '1')
    }
  }, [id, path, title])

  return null
}
