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
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const updateToc = () => {
      const headings = document.querySelectorAll(
        '.prose h1, .prose h2, .prose h3'
      )
      const items: TocItem[] = []

      headings.forEach((heading) => {
        const id = heading.id
        if (!id || !id.startsWith('autoid_')) return

        items.push({
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        })
      })

      setTocItems(items)
    }

    const timer = setTimeout(updateToc, 100)
    return () => clearTimeout(timer)
  }, [html])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()

    const element = document.getElementById(id)
    if (!element) return

    const offset = 100 // ← この数値を変更して余白を調整
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }

  if (tocItems.length === 0) return null

  return (
    <div className="tableOfContents js-accordionBox rounded-xl bg-white shadow-sm">
      <p
        className="tableOfContents_title js-accordionTrigger flex cursor-pointer items-center justify-between p-4 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          <span className="big mr-2 text-lg">CONTENTS</span>目次
        </span>
        <span className="text-sm text-gray-600">
          {isOpen ? '閉じる' : '開く'}
        </span>
      </p>
      <div
        className={`tableOfContents_body js-accordionBody ${isOpen ? 'is-open' : ''}`}
      >
        <div className="p-4">
          <ul className="space-y-2">
            {tocItems.map((item) => {
              return (
                <li
                  key={item.id}
                  className={`headingLv_${item.level} ${
                    item.level === 1 ? 'list-none' : 'list-disc'
                  }`}
                  style={{
                    paddingLeft: `${(item.level - 1) * 16}px`,
                    listStylePosition: 'inside',
                  }}
                >
                  <a
                    href={`#${item.id}`}
                    className={`link inline cursor-pointer transition-colors hover:text-[color:var(--accent)] ${
                      item.level === 1
                        ? 'text-2xl font-bold text-gray-900'
                        : item.level === 2
                          ? 'text-base font-semibold text-gray-800 decoration-gray-800 underline-offset-4'
                          : 'text-sm font-normal text-gray-700'
                    }`}
                    onClick={(e) => handleClick(e, item.id)}
                  >
                    {item.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
