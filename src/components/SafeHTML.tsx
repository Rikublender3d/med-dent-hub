'use client'

import DOMPurify from 'isomorphic-dompurify'
import { useEffect, useState, useRef } from 'react'

interface SafeHTMLProps {
  html: string
  className?: string
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

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
