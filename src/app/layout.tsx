import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager'
import { GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager'
import { AutoBtnId } from '@/components/analytics/AutoBtnId'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku-gothic-new',
})

export const metadata: Metadata = {
  title: {
    default: '医者と歯医者の交換日記',
    template: '%s - 医者と歯医者の交換日記',
  },
  description: '医者と歯医者の交換日記',
  icons: {
    icon: '/1.png',
    shortcut: '/1.png',
    apple: '/1.png',
  },
  metadataBase: new URL('https://med-dent-hub.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: '医者と歯医者の交換日記',
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
    creator: '@',
    site: '@',
    images: ['/1.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <GoogleTagManager />
      </head>
      <body className={`${zenKakuGothicNew.variable} antialiased`}>
        <GoogleTagManagerNoScript />
        <AutoBtnId />
        <Header />
        <Suspense fallback={null}>
          <Breadcrumb />
        </Suspense>
        <main className="container mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
