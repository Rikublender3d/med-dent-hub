'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'

export default function NewsletterBanner() {
  const [isBannerVisible, setIsBannerVisible] = useState(false)

  useEffect(() => {
    // 少し遅延させて表示
    const timer = setTimeout(() => {
      setIsBannerVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleCloseBanner = () => {
    setIsBannerVisible(false)
  }

  return (
    <>
      {/* Desktop Floating Banner */}
      <AnimatePresence>
        {isBannerVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 100 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed right-6 bottom-6 z-50 hidden max-w-sm md:block"
          >
            <div className="relative rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 text-white shadow-2xl">
              <button
                onClick={handleCloseBanner}
                className="absolute top-2 right-2 cursor-pointer text-white transition-colors hover:text-gray-200"
                aria-label="閉じる"
              >
                <IoClose className="h-5 w-5" />
              </button>
              <div className="pr-6">
                <h3 className="mb-2 text-xl font-bold">
                  医科歯科連携マニュアル
                </h3>
                <p className="mb-4 text-sm opacity-90">
                  現場で使える医科歯科連携マニュアルの無料ダウンロード
                </p>
                <Link
                  href="/newsletter"
                  className="inline-block rounded-full bg-white px-6 py-2 text-sm font-semibold text-[#2563EB] transition-colors duration-300 hover:bg-gray-100"
                >
                  無料ダウンロード →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Banner */}
      <AnimatePresence>
        {isBannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="fixed right-0 bottom-0 left-0 z-50 md:hidden"
            style={{ height: '120px' }}
          >
            <div className="relative flex h-full items-center bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] px-4 text-white">
              <button
                onClick={handleCloseBanner}
                className="absolute top-2 right-2 cursor-pointer text-white transition-colors hover:text-gray-200"
                aria-label="閉じる"
              >
                <IoClose className="h-5 w-5" />
              </button>
              <div className="flex-1 pr-8">
                <h3 className="mb-1 text-lg font-bold">
                  医科歯科連携マニュアル
                </h3>
                <p className="mb-3 text-xs opacity-90">
                  現場で使える医科歯科連携マニュアルの無料ダウンロード
                </p>
                <Link
                  href="/newsletter"
                  className="inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2563EB] transition-colors duration-300 hover:bg-gray-100"
                >
                  無料ダウンロード →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
