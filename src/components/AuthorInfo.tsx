import Image from 'next/image'
import type { Author, SnsPlatform } from '@/types/microcms'

const DEFAULT_AUTHOR: Author = {
  name: '編集部',
  avatar: { url: '', width: 0, height: 0 },
  role: '編集部',
  bio: '医者と歯医者の交換日記編集部です。医科歯科連携に関する最新情報や実践的なノウハウをお届けしています。',
}

/**
 * 各 SNS のブランドガイドライン準拠カラー + アイコン
 * - X: 黒のみ（公式: #000000）
 * - Facebook: Facebook Blue（公式: #1877F2）
 * - Instagram: グリフは任意単色可 → 黒を使用
 * - YouTube: YouTube Red（公式: #FF0000）はロゴ専用 → アイコンは黒
 * - note: /note.svg（公式アセット）を使用
 * - Other: 汎用リンクアイコン
 */
function SnsIcon({ platform }: { platform: SnsPlatform }) {
  if (platform === 'Twitter(新X)') {
    return (
      <svg
        className="h-5 w-5"
        fill="#000000"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  } else if (platform === 'Facebook') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.791-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.384C19.612 22.954 24 17.99 24 12z"
        />
      </svg>
    )
  } else if (platform === 'Instagram') {
    return (
      <svg
        className="h-5 w-5"
        fill="#000000"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    )
  } else if (platform === 'Youtube') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#FF0000"
          d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        />
        <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  } else if (platform === 'Note') {
    return (
      <Image
        src="/note.svg"
        alt="note"
        width={20}
        height={20}
        className="h-5 w-5"
      />
    )
  } else if (platform === 'LinkedIn') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#0A66C2"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      </svg>
    )
  } else {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="#757575"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    )
  }
}

interface AuthorInfoProps {
  author?: Author
}

export default function AuthorInfo({ author }: AuthorInfoProps) {
  const a = author ?? DEFAULT_AUTHOR
  const hasAvatar = a.avatar.url !== ''
  const snsLinks = (a.sns ?? []).filter(
    (s) => s.platform && s.platform.length > 0 && s.link
  )

  return (
    <div className="mt-12 rounded-xl border border-[color:var(--frame)] bg-[color:var(--frame)]/30 p-6">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 ring-2 ring-white">
          {hasAvatar ? (
            <Image
              src={a.avatar.url}
              alt={a.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-gray-500">
              👨‍⚕️
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
            {a.name}
          </h3>
          <p className="text-sm text-gray-500">{a.role}</p>
          {a.bio && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {a.bio}
            </p>
          )}
          {snsLinks.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              {snsLinks.map((s) => {
                const platform = s.platform![0]
                return (
                  <a
                    key={`${platform}-${s.link}`}
                    href={s.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex transition-opacity hover:opacity-70"
                    title={platform}
                  >
                    <SnsIcon platform={platform} />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
