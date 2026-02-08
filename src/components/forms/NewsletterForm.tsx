'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const initialFormData = {
    email: '',
    name: '',
    profession: '',
    workType: '',
    workFor: '',
    department: '',
    yearsOfExperience: '',
    qualifications: '',
    registrationRoute: '',
  }
  const [formData, setFormData] = useState(initialFormData)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      alert('プライバシーポリシーと利用規約に同意してください')
      return
    }

    setIsLoading(true)

    try {
      // 自分のAPI Routeを呼ぶ（CORS問題なし）
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData(initialFormData)
      } else {
        alert(result.error ?? '送信に失敗しました')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('送信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <div className="mb-4 text-6xl">✓</div>
        <h3 className="mb-2 text-2xl font-bold text-green-800">登録完了！</h3>
        <p className="mb-4 text-green-600">ご登録ありがとうございます。</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="font-medium text-blue-600 hover:underline"
        >
          ← 戻る
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
        医者と歯医者の交換日記
        <br />
        メールマガジン登録
      </h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="example@email.com"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="山田太郎"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          職種 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.profession}
          onChange={(e) =>
            setFormData({ ...formData, profession: e.target.value })
          }
          required
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">選択してください</option>
          <option value="医師">医師</option>
          <option value="歯科医師">歯科医師</option>
          <option value="看護師">看護師</option>
          <option value="歯科衛生士">歯科衛生士</option>
          <option value="医療事務">医療事務</option>
          <option value="受付">受付</option>
          <option value="その他医療関係者">その他医療関係者</option>
          <option value="医療関係者以外">医療関係者以外</option>
        </select>
      </div>
      {/* 医療関係者（医療関係者以外以外）のとき表示：勤務形態 / 勤務先の種別 / 診療科・担当領域 / 経験年数 */}
      {formData.profession !== '' &&
        formData.profession !== '医療関係者以外' && (
          <>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                勤務形態 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.workType}
                onChange={(e) =>
                  setFormData({ ...formData, workType: e.target.value })
                }
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">選択してください</option>
                <option value="勤務医">勤務医</option>
                <option value="開業医">開業医</option>
                <option value="研修医">研修医</option>
                <option value="非常勤中心">非常勤中心</option>
                <option value="正社員">正社員</option>
                <option value="パート・非常勤">パート・非常勤</option>
                <option value="契約">契約</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                勤務先の種別 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.workFor}
                onChange={(e) =>
                  setFormData({ ...formData, workFor: e.target.value })
                }
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">選択してください</option>
                <option value="大学病院">大学病院</option>
                <option value="市中病院">市中病院</option>
                <option value="クリニック">クリニック</option>
                <option value="企業">企業</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                診療科・担当領域（複数可）{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="例：内科、外科、歯科、病棟、外来など"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                経験年数（医師の場合は医師年数）{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yearsOfExperience: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">選択してください</option>
                <option value="〜5年">〜5年</option>
                <option value="6–10年">6–10年</option>
                <option value="11–20年">11–20年</option>
                <option value="21年以上">21年以上</option>
              </select>
            </div>
          </>
        )}

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          保有資格・免許・認定など
        </label>
        <textarea
          value={formData.qualifications}
          onChange={(e) =>
            setFormData({ ...formData, qualifications: e.target.value })
          }
          disabled={isLoading}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="例：専門医、認定医、情報処理資格、語学資格、その他免許・認定"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          登録経路 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.registrationRoute}
          onChange={(e) =>
            setFormData({ ...formData, registrationRoute: e.target.value })
          }
          required
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">選択してください</option>
          <option value="検索">検索</option>
          <option value="SNS">SNS</option>
          <option value="紹介">紹介</option>
          <option value="セミナー">セミナー</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            disabled={isLoading}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            <a
              href="/privacy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              プライバシーポリシー
            </a>
            および
            <a
              href="/terms"
              className="text-blue-600 underline hover:text-blue-800"
            >
              利用規約
            </a>
            に同意します <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || !agreedToTerms}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isLoading ? '送信中...' : '送信'}
      </button>
    </form>
  )
}
