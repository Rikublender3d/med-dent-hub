import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getTags } from '@/lib/microCMS/microcms'
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager'
import { GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager'
import { AutoBtnId } from '@/components/analytics/AutoBtnId'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku-gothic-new',
})

const SITE_DESCRIPTION =
  '医療の明日を、現場からよくする。医科歯科連携の判断に迷う場面で役立つ「現場で使える視点」をまとめたメディア。医師・歯科医師・患者の判断を支える情報を発信します。'

export const metadata: Metadata = {
  title: {
    default: '医者と歯医者の交換日記',
    template: '%s - 医者と歯医者の交換日記',
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  metadataBase: new URL('https://med-dent-hub.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: '医者と歯医者の交換日記',
    description: SITE_DESCRIPTION,
    url: 'https://med-dent-hub.vercel.app',
    locale: 'ja_JP',
    images: [
      {
        url: '/1.png',
        width: 1200,
        height: 630,
        alt: '医者と歯医者の交換日記',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    description: SITE_DESCRIPTION,
    creator: '@',
    site: '@',
    images: ['/1.png'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const tagsRes = await getTags()
  const tags = tagsRes.contents.map(({ id, name }) => ({ id, name }))

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
      </head>
      <body className={`${zenKakuGothicNew.variable} antialiased`}>
        <GoogleTagManagerNoScript />
        <AutoBtnId />
        <Header tags={tags} />
        <Suspense fallback={null}>
          <Breadcrumb />
        </Suspense>
        <main className="container mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
