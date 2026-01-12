import { createCorsResponse, createCorsOptionsResponse } from '@/lib/api/cors'
import { fetchPopularArticleIds } from '@/lib/analytics/googleAnalytics'
import { updatePopularArticles } from '@/lib/microCMS/popular'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * 人気記事を更新するAPIエンドポイント
 * POST /api/popular-articles
 * クエリパラメータ:
 *   - limit: 取得件数（デフォルト: 10）
 *   - startDate: 開始日（デフォルト: 8daysAgo）
 *   - endDate: 終了日（デフォルト: 1daysAgo）
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const startDate = searchParams.get('startDate') || '8daysAgo'
    const endDate = searchParams.get('endDate') || '1daysAgo'

    console.log('=== 人気記事更新開始 ===')
    console.log(`期間: ${startDate} ~ ${endDate}`)
    console.log(`件数: ${limit}件`)

    // 1. GA4から人気記事IDを取得
    const articleIds = await fetchPopularArticleIds(limit, {
      startDate,
      endDate,
    })

    if (articleIds.length === 0) {
      return createCorsResponse({
        success: false,
        message: 'GA4からデータを取得できませんでした',
        count: 0,
        articleIds: [],
      })
    }

    // 2. microCMSに保存
    await updatePopularArticles(articleIds)

    console.log('=== 人気記事更新完了 ===')

    return createCorsResponse({
      success: true,
      message: '人気記事を更新しました',
      count: articleIds.length,
      articleIds,
    })
  } catch (error) {
    console.error('❌ 人気記事更新エラー:', error)

    return createCorsResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}

// OPTIONSリクエスト（CORS preflight）に対応
export async function OPTIONS() {
  return createCorsOptionsResponse()
}

/**
 * GETリクエストも同じ処理（Cron用）
 */
export async function GET(request: Request) {
  return POST(request)
}
