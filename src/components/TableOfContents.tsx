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

  useEffect(() => {
    // HTMLから見出しタグを抽出
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

    const items: TocItem[] = []
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      const id = `heading-${index}`

      // 見出しにIDを設定（実際のDOMには反映されないが、目次用）
      items.push({
        id,
        text,
        level,
      })
    })

    setTocItems(items)
  }, [html])

  useEffect(() => {
    // スクロール位置に基づいてアクティブな見出しを更新
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let current = ''

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 100) {
          current =
            heading.id || `heading-${Array.from(headings).indexOf(heading)}`
        }
      })

      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHeading = (index: number) => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const heading = headings[index]
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        {tocItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(index)}
            className={`block w-full cursor-pointer text-left text-sm transition-colors hover:text-[color:var(--accent)] ${
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
