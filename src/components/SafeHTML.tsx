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
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id', 'width', 'height',
        'target', 'rel'
      ],
      ALLOW_DATA_ATTR: false,
      FORCE_BODY: true,
      // 外部リンクに rel="noopener noreferrer" を追加
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
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

