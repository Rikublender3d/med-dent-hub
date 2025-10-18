'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  html: string
}

export function TableOfContents({ html }: Props) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // HTMLから見出しを抽出して目次を生成
  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

    const items: TocItem[] = []
    headings.forEach((heading) => {
      const text = heading.textContent?.trim()
      if (text) {
        const level = parseInt(heading.tagName.charAt(1))
        const id = `heading-${items.length + 1}`

        // 見出しにIDを追加（実際のDOMには影響しない）
        items.push({
          id,
          text,
          level,
        })
      }
    })

    setTocItems(items)
  }, [html])

  // スクロール位置に基づいてアクティブな見出しを更新
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let current = ''

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 100) {
          current =
            heading.id || `heading-${Array.from(headings).indexOf(heading) + 1}`
        }
      })

      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 見出しにIDを追加する関数
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index + 1}`
      }
    })
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
        目次
      </h3>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`block w-full text-left text-sm transition-colors hover:text-[color:var(--accent)] ${
              activeId === item.id
                ? 'font-medium text-[color:var(--accent)]'
                : 'text-gray-600'
            }`}
            style={{
              paddingLeft: `${(item.level - 1) * 12}px`,
            }}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  )
}
