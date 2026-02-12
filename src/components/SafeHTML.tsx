'use client'

import DOMPurify from 'isomorphic-dompurify'
import { useEffect, useState, useRef } from 'react'

/**
 * microCMS の画像 URL を最適化する（記事本文内の画像専用）
 * @param url microCMS の画像 URL（既にクエリパラメータが付いている可能性あり）
 * @param width 表示幅（Retina + 圧縮劣化を補うため3倍サイズを取得）
 * @returns 最適化された画像 URL
 */
function optimizeMicroCMSImage(
  url: string,
  width: number
): string {
  if (!url) return url

  // microCMS の画像 URL かチェック
  if (!url.includes('microcms-assets.io')) {
    return url
  }

  // 既存のクエリパラメータを除去して元画像URLを取得
  const [baseUrl] = url.split('?')

  // 3倍サイズを取得（Retina対応 + 圧縮の劣化を補う）
  const targetWidth = width * 3

  // クエリパラメータを追加
  const params = new URLSearchParams({
    w: targetWidth.toString(),
    q: '95', // 最高画質
    fm: 'webp', // WebP形式
    fit: 'scale', // fit=scaleで品質を保つ
  })

  return `${baseUrl}?${params.toString()}`
}

interface SafeHTMLProps {
  html: string
  className?: string
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let processedHtml = html
    // 記事本文内のmicroCMS画像URLを最適化
    processedHtml = processedHtml.replace(
      /<img[^>]+>/gi,
      (imgTag) => {
        // src属性を抽出
        const srcMatch = imgTag.match(/src=["']([^"']+)["']/i)
        if (!srcMatch) return imgTag

        const url = srcMatch[1]

        // microCMS画像じゃなければスキップ
        if (!url.includes('microcms-assets.io')) return imgTag

        // width属性を抽出
        const widthMatch = imgTag.match(/width=["'](\d+)["']/i)
        const width = widthMatch ? parseInt(widthMatch[1], 10) : 800

        // 最適化
        const optimizedUrl = optimizeMicroCMSImage(url, width)

        // srcだけ置き換え
        return imgTag.replace(/src=["'][^"']*["']/, `src="${optimizedUrl}"`)
      }
    )

    // DOMPurifyでHTMLをサニタイズ
    const clean = DOMPurify.sanitize(processedHtml, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'a',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'div',
        'span',
        'iframe',
        'embed',
        'object',
        'video',
        'audio',
        'source',
        'figure',
        'figcaption',
        'hr',
        'del',
        'ins',
        'mark',
        'small',
        'sub',
        'sup',
      ],
      ALLOWED_ATTR: [
        'href',
        'src',
        'alt',
        'title',
        'class',
        'id',
        'width',
        'height',
        'target',
        'rel',
        'frameborder',
        'allowfullscreen',
        'allow',
        'sandbox',
        'loading',
        'controls',
        'autoplay',
        'loop',
        'muted',
        'poster',
        'preload',
        'type',
        'data-*',
        'style',
        'scrolling',
        'marginwidth',
        'marginheight',
      ],
      ALLOW_DATA_ATTR: true,
      FORCE_BODY: true,
      // 外部リンクに rel="noopener noreferrer" を追加
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
      KEEP_CONTENT: true,
      ADD_ATTR: ['allow', 'id', 'class'],
      ADD_TAGS: ['iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    })
    setSanitizedHTML(clean)
  }, [html])

  useEffect(() => {
    if (!containerRef.current) return

    const headings = containerRef.current.querySelectorAll('h1, h2, h3')
    const counts: Record<number, number> = {}

    headings.forEach((heading) => {
      if (heading.id && heading.id.startsWith('autoid_')) return

      const level = parseInt(heading.tagName.charAt(1))
      counts[level] = (counts[level] || 0) + 1
      heading.id = `autoid_${level}_${counts[level]}`
    })
  }, [sanitizedHTML])

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
