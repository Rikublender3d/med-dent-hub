'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize gtag and load script once
  useEffect(() => {
    if (!GA_ID) return

    // Define gtag immediately to avoid not-a-function errors
    const w = window as any
    if (typeof w.gtag !== 'function') {
      w.dataLayer = w.dataLayer || []
      w.gtag = function () {
        w.dataLayer.push(arguments)
      }
      w.gtag('js', new Date())
      w.gtag('config', GA_ID, { send_page_view: false })
    }

    // Load external script if not already present
    if (!document.getElementById('ga-script')) {
      const script = document.createElement('script')
      script.id = 'ga-script'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(script)
    }
  }, [])

  // send page_view on route change
  useEffect(() => {
    if (!GA_ID || !pathname) return
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
    const w = window as any
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', { page_path: url })
    }
  }, [pathname, searchParams])

  return null
}
