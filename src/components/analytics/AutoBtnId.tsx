'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/** pathname を btn_id 用の pathId に正規化（先頭・末尾の / 除去、/ を - に） */
function toPathId(pathname: string): string {
  return pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'top'
}

/**
 * 内部リンククリック時に href に ?btn_id=xxx を付与する。
 * リンクの通常遷移はそのままなので、GTM の「クリック - リンクのみ」／「内部リンククリック」が発火し、
 * Click URL が相対パス（/about?btn_id=xxx）になり、GA4 に送信できる。
 *
 * 動作フロー:
 * 1. ユーザーがリンクをクリック
 * 2. AutoBtnId が href に ?btn_id=xxx を追加（相対パスで上書き）
 * 3. ブラウザがリンクを辿る（Next.js のルーティング）
 * 4. GTM の「クリック - リンクのみ」トリガーが発火
 * 5. Click URL は相対パス（/about?btn_id=xxx）になる
 * 6. 内部リンククリックトリガーの条件に合致 → GA4 に送信
 */
export function AutoBtnId() {
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      try {
        const linkOrigin = new URL(link.href).origin
        if (linkOrigin !== window.location.origin) return
      } catch {
        return
      }
      if (link.href.includes('btn_id=')) return

      const sourcePage = toPathId(pathnameRef.current)
      const clickLocation = link.getAttribute('data-location') ?? 'auto'
      const btnId = `${sourcePage}--${clickLocation}`

      const url = new URL(link.href, window.location.origin)
      url.searchParams.set('btn_id', btnId)
      // 相対パスで上書きし、preventDefault しないので通常のリンク遷移になる
      link.href = url.pathname + url.search + url.hash
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return null
}
