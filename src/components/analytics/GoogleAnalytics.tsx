"use client"

import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Track page views
export function trackPageView(url: string, title: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_title: title,
      page_location: url,
    })
  }
}

// Track article views
export function trackArticleView(articleId: string, articleTitle: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'article_view', {
      article_id: articleId,
      article_title: articleTitle,
      page_title: articleTitle,
    })
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
