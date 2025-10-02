import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/microCMS/microcms'

// Mock popular articles based on GA4 data
// In production, this would fetch from GA4 Reporting API
export async function GET() {
  try {
    // Get all articles
    const { contents } = await getArticles()
    
    // Mock popular articles (in real implementation, this would come from GA4)
    // For now, we'll simulate popularity by taking the first 6 articles
    const popularArticles = contents.slice(0, 6)
    
    return NextResponse.json({
      articles: popularArticles,
      period: '30days',
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching popular articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular articles' },
      { status: 500 }
    )
  }
}
