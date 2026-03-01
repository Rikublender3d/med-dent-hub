'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { HeroCarousel } from '@/components/HeroCarousel'
import { ABTestTracker } from '@/components/ABTestTracker'
import type { ArticleWithEndpoint } from '@/types/microcms'

interface ABHeroProps {
  carouselArticles: ArticleWithEndpoint[]
  heroA: ReactNode
  heroCompact: ReactNode
}

export function ABHero({ carouselArticles, heroA, heroCompact }: ABHeroProps) {
  const [variant, setVariant] = useState<'a' | 'b' | null>(null)

  useEffect(() => {
    setVariant(Math.random() < 0.5 ? 'a' : 'b')
  }, [])

  // 初回レンダリング時はバリアントA（現行）を表示してCLSを防ぐ
  if (variant === null) {
    return <>{heroA}</>
  }

  return (
    <>
      <ABTestTracker key="tracker" variant={variant} />
      {variant === 'b' && carouselArticles.length > 0 ? (
        <>
          <HeroCarousel key="carousel" articles={carouselArticles} />
          <div key="compact">{heroCompact}</div>
        </>
      ) : (
        <div key="hero-a">{heroA}</div>
      )}
    </>
  )
}
