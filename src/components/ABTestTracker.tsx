'use client'

import { useEffect } from 'react'

export function ABTestTracker({ variant }: { variant: 'a' | 'b' }) {
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'ab_test_view', {
        experiment_id: 'hero_carousel',
        variant,
      })
    }
  }, [variant])

  return null
}
