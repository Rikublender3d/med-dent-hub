'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { track } from '@vercel/analytics'

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: {
        page_path?: string
        page_title?: string
        [key: string]: unknown
      }
    ) => void
    dataLayer?: unknown[]
  }
}

export default function PageAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const path = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`

    // Vercel Analytics
    track('page_view', { path })

    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: path,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}
