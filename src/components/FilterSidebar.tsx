'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Category, Tag } from '@/types/microcms'
import { useCallback, useMemo } from 'react'

interface FilterSidebarProps {
  categories: Category[]
  tags: Tag[]
  selectedCategoryId?: string
  selectedTagIds?: string[]
}

export default function FilterSidebar({
  categories,
  tags,
  selectedCategoryId,
  selectedTagIds = [],
}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)
    : null

  const selectedTags = useMemo(
    () => tags.filter((t) => selectedTagIds.includes(t.id)),
    [tags, selectedTagIds]
  )

  const handleTagToggle = useCallback(
    (tagId: string) => {
      const currentTags = selectedTagIds || []
      const newTags = currentTags.includes(tagId)
        ? currentTags.filter((id) => id !== tagId)
        : [...currentTags, tagId]

      const params = new URLSearchParams(searchParams.toString())

      if (newTags.length === 0) {
        params.delete('tag')
      } else {
        params.delete('tag')
        newTags.forEach((id) => {
          params.append('tag', id)
        })
      }

      router.push(`/articles?${params.toString()}`)
    },
    [selectedTagIds, searchParams, router]
  )

  return (
    <div className="space-y-6">
      {/* カテゴリーフィルター */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
          カテゴリー
        </h2>
        <ul className="space-y-1">
          <li>
            <Link
              href="/articles"
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                !selectedCategoryId
                  ? 'bg-[color:var(--accent)]/10 font-semibold text-[color:var(--accent)]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  !selectedCategoryId
                    ? 'bg-[color:var(--accent)]'
                    : 'bg-transparent'
                }`}
              />
              <span>すべて</span>
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/articles?category=${category.id}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  selectedCategoryId === category.id
                    ? 'bg-[color:var(--accent)]/10 font-semibold text-[color:var(--accent)]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    selectedCategoryId === category.id
                      ? 'bg-[color:var(--accent)]'
                      : 'bg-transparent'
                  }`}
                />
                <span className="flex-1">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* タグフィルター */}
      {tags.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[color:var(--foreground)]">
            タグで絞り込む
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedTagIds.length === 0 ? (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  router.push(`/articles?${params.toString()}`)
                }}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedTagIds.length === 0
                    ? 'bg-[color:var(--accent)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
            ) : (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('tag')
                  router.push(`/articles?${params.toString()}`)
                }}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                すべて
              </button>
            )}
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-[color:var(--accent)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 選択中のフィルター表示 */}
      {(selectedCategory || selectedTags.length > 0) && (
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="mb-2 text-sm font-medium text-blue-800">
            現在のフィルター:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                カテゴリー: {selectedCategory.name}
                <Link
                  href={
                    selectedTagIds.length > 0
                      ? `/articles?${selectedTagIds.map((id) => `tag=${id}`).join('&')}`
                      : '/articles'
                  }
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </Link>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                タグ: #{tag.name}
                <button
                  onClick={() => handleTagToggle(tag.id)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Link
            href="/articles"
            className="mt-3 block text-sm text-blue-600 underline hover:text-blue-800"
          >
            すべてクリア
          </Link>
        </div>
      )}
    </div>
  )
}
