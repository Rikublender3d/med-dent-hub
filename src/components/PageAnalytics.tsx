'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { track } from '@vercel/analytics'

export default function PageAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const path = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
    track('page_view', { path })
  }, [pathname, searchParams])

  return null
}
