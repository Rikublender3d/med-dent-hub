'use client'

import { FormEvent, useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  organization: string
  profession: string
  subject: string
  message: string
  agree: boolean
}

interface ApiResponse {
  success: boolean
  error?: string
}

const initialFormState: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  profession: '',
  subject: '',
  message: '',
  agree: false,
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data?.error ?? 'Failed to submit contact form.')
      }

      setIsSubmitted(true)
      setForm(initialFormState)
    } catch (err) {
      console.error('Contact form submission error:', err)
      setError(
        err instanceof Error
          ? err.message
          : '送信に失敗しました。時間をおいて再度お試しください。'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h3 className="mb-2 text-2xl font-bold text-green-800">
          お問い合わせを受け付けました
        </h3>
        <p className="mb-6 text-green-600">
          担当者より折り返しご連絡いたしますので、しばらくお待ちください。
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false)
            setError(null)
          }}
          className="rounded-lg px-6 py-2 text-blue-600 underline transition hover:text-blue-700"
        >
          もう一度送信する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            placeholder="山田太郎"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            電話番号（任意）
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            placeholder="090-1234-5678"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            所属・団体（任意）
          </label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            placeholder="〇〇病院／〇〇クリニック"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            職種
          </label>
          <select
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">選択してください</option>
            <option value="医者">医者</option>
            <option value="歯科医師">歯科医師</option>
            <option value="看護師">看護師</option>
            <option value="歯科衛生士">歯科衛生士</option>
            <option value="医療事務">医療事務</option>
            <option value="その他医療関係者">その他医療関係者</option>
            <option value="学生">学生</option>
            <option value="一般">一般</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="お問い合わせの件名"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={6}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="できるだけ具体的にご記入ください"
        />
      </div>

      <div>
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            className="mt-1"
            disabled={isSubmitting}
            required
          />
          <span className="text-sm text-gray-700">
            <a
              href="/privacy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              プライバシーポリシー
            </a>
            に同意します
          </span>
        </label>
      </div>

      <div>
        {error && (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!form.agree || isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? '送信中…' : '送信'}
        </button>
      </div>
    </form>
  )
}
