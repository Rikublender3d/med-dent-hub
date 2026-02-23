import type { Metadata } from 'next'

/**
 * プレビュー（下書き）ページ用レイアウト
 * 検索エンジンにインデックスされないよう noindex を設定
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function DraftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
