import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku-gothic-new',
})

export const metadata: Metadata = {
  title: '医師と歯医者の交換日記',
  description: '医師と歯医者の交換日記',
  icons: {
    icon: '/1.png',
    shortcut: '/1.png',
    apple: '/1.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${zenKakuGothicNew.variable} antialiased`}>
        <Header />
        <main className="container mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
