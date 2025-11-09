'use client'

import Script from 'next/script'

/**
 * Google Analytics タグを設置するコンポーネント
 *
 * 環境変数 NEXT_PUBLIC_GA_ID に測定ID（G-XXXXXXXXXX）を設定してください
 */
export default function GoogleAnalyticsScript() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (!gaId) {
    console.warn(
      '⚠️ NEXT_PUBLIC_GA_ID is not set. Google Analytics will not be loaded.'
    )
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
