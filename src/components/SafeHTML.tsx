'use client'

import DOMPurify from 'isomorphic-dompurify'
import { useEffect, useState } from 'react'

interface SafeHTMLProps {
  html: string
  className?: string
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('')

  useEffect(() => {
    // DOMPurifyでHTMLをサニタイズ
    const clean = DOMPurify.sanitize(html, {
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
      ],
      ALLOW_DATA_ATTR: true,
      FORCE_BODY: true,
      // 外部リンクに rel="noopener noreferrer" を追加
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
      // iframeの特定ドメインを許可
      ADD_ATTR: ['allow'],
    })
    setSanitizedHTML(clean)
  }, [html])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
