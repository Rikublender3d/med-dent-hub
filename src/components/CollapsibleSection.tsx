'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  accent?: boolean
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  accent = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50/60 lg:hidden"
        aria-expanded={isOpen}
      >
        {accent && (
          <span className="h-4 w-1 flex-shrink-0 rounded-full bg-[color:var(--accent)]" />
        )}
        <span className="flex-1 text-[0.8125rem] font-bold tracking-wide text-[color:var(--foreground)] uppercase">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200"
        >
          <svg
            className="h-3 w-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      {/* SP: アコーディオン */}
      <div className="lg:hidden">
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.25, ease: 'easeOut' },
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 px-5 pt-4 pb-5">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* デスクトップ: 常時表示 */}
      <div className="hidden lg:block">
        <div className="px-5 pt-5 pb-6">
          <div className="mb-4 flex items-center gap-2">
            {accent && (
              <span className="h-4 w-1 rounded-full bg-[color:var(--accent)]" />
            )}
            <h3 className="text-[0.8125rem] font-bold tracking-wide text-[color:var(--foreground)] uppercase">
              {title}
            </h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
