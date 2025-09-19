import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku-gothic-new',
})

export const metadata: Metadata = {
  title: 'Med×Dent Hub',
  description: 'Med×Dent Hub',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${zenKakuGothicNew.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
