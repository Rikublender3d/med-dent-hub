'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    profession: '',
    subject: '',
    message: '',
    agree: false,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // 枠組みのみ（送信処理は未実装）
        console.log('contact draft submit', form)
      }}
      className="space-y-6"
    >
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            <option value="医師">医師</option>
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
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          送信（仮）
        </button>
      </div>
    </form>
  )
}
