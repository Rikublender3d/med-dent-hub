import Link from 'next/link'
import { Category, Tag } from '@/types/microcms'

interface FilterSidebarProps {
  categories: Category[]
  tags: Tag[]
  selectedCategoryId?: string
  selectedTagId?: string
}

export default function FilterSidebar({
  categories,
  tags,
  selectedCategoryId,
  selectedTagId,
}: FilterSidebarProps) {
  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)
    : null
  const selectedTag = selectedTagId
    ? tags.find((t) => t.id === selectedTagId)
    : null

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
              href="/posts"
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
                href={`/posts?category=${category.id}`}
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
            <Link
              href={
                selectedCategoryId
                  ? `/posts?category=${selectedCategoryId}`
                  : '/posts'
              }
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                !selectedTagId
                  ? 'bg-[color:var(--accent)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </Link>
            {tags.map((tag) => {
              const href = selectedCategoryId
                ? `/posts?category=${selectedCategoryId}&tag=${tag.id}`
                : `/posts?tag=${tag.id}`
              return (
                <Link
                  key={tag.id}
                  href={href}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTagId === tag.id
                      ? 'bg-[color:var(--accent)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* 選択中のフィルター表示 */}
      {(selectedCategory || selectedTag) && (
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
                    selectedTagId ? `/posts?tag=${selectedTagId}` : '/posts'
                  }
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </Link>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                タグ: #{selectedTag.name}
                <Link
                  href={
                    selectedCategoryId
                      ? `/posts?category=${selectedCategoryId}`
                      : '/posts'
                  }
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </Link>
              </span>
            )}
          </div>
          <Link
            href="/posts"
            className="mt-3 block text-sm text-blue-600 underline hover:text-blue-800"
          >
            すべてクリア
          </Link>
        </div>
      )}
    </div>
  )
}
