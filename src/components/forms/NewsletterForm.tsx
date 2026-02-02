'use client'

import { useState } from 'react'

// 診療科の選択肢
const DEPARTMENTS = [
  '内科',
  '外科',
  '小児科',
  '産婦人科',
  '整形外科',
  '皮膚科',
  '眼科',
  '耳鼻咽喉科',
  '泌尿器科',
  '精神科',
  '神経内科',
  '循環器内科',
  '消化器内科',
  '呼吸器内科',
  '糖尿病内科',
  '腎臓内科',
  '血液内科',
  'リウマチ科',
  '麻酔科',
  '放射線科',
  '病理科',
  '救急科',
  '形成外科',
  '脳神経外科',
  '心臓血管外科',
  '呼吸器外科',
  '消化器外科',
  'リハビリテーション科',
  '歯科',
  '口腔外科',
  '矯正歯科',
  '小児歯科',
  'その他',
]

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    profession: '',
    workStyle: '',
    workplaceType: '',
    departments: [] as string[],
    yearsOfExperience: '',
    qualifications: '',
    registrationSource: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 医療関係者以外かどうかを判定
  const isNonMedical = formData.profession === '医療関係者以外'

  const handleDepartmentChange = (dept: string) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept],
    }))
  }

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
        body: JSON.stringify({
          ...formData,
          departments: formData.departments.join(', '),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          email: '',
          name: '',
          profession: '',
          workStyle: '',
          workplaceType: '',
          departments: [],
          yearsOfExperience: '',
          qualifications: '',
          registrationSource: '',
        })
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
        <p className="mb-4 text-green-600">
          ご登録ありがとうございます。ダウンロードリンクをメールでお送りしました。
        </p>
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
        医科歯科連携マニュアル&フォーマット
        <br />
        ダウンロード登録
      </h2>

      {/* メールアドレス */}
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

      {/* 氏名 */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          氏名 <span className="text-red-500">*</span>
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

      {/* 職種 */}
      <div className="mb-4">
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
          <option value="歯科技工士">歯科技工士</option>
          <option value="歯科助手">歯科助手</option>
          <option value="薬剤師">薬剤師</option>
          <option value="理学療法士">理学療法士</option>
          <option value="作業療法士">作業療法士</option>
          <option value="言語聴覚士">言語聴覚士</option>
          <option value="放射線技師">放射線技師</option>
          <option value="臨床検査技師">臨床検査技師</option>
          <option value="管理栄養士">管理栄養士</option>
          <option value="医療事務">医療事務</option>
          <option value="受付">受付</option>
          <option value="その他医療関係者">その他医療関係者</option>
          <option value="医療関係者以外">医療関係者以外</option>
        </select>
      </div>

      {/* 医療関係者以外の場合は以下の項目を非表示 */}
      {!isNonMedical && (
        <>
          {/* 勤務形態 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              勤務形態
            </label>
            <select
              value={formData.workStyle}
              onChange={(e) =>
                setFormData({ ...formData, workStyle: e.target.value })
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">選択してください</option>
              <option value="勤務医">勤務医</option>
              <option value="開業医">開業医</option>
              <option value="研修医">研修医</option>
              <option value="非常勤中心">非常勤中心</option>
              <option value="常勤">常勤</option>
              <option value="パート・アルバイト">パート・アルバイト</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* 勤務先の種別 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              勤務先の種別
            </label>
            <select
              value={formData.workplaceType}
              onChange={(e) =>
                setFormData({ ...formData, workplaceType: e.target.value })
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">選択してください</option>
              <option value="大学病院">大学病院</option>
              <option value="市中病院">市中病院</option>
              <option value="クリニック">クリニック</option>
              <option value="歯科医院">歯科医院</option>
              <option value="企業">企業</option>
              <option value="介護施設">介護施設</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* 診療科（複数選択可） */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              診療科（複数選択可）
            </label>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-300 p-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DEPARTMENTS.map((dept) => (
                  <label key={dept} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.departments.includes(dept)}
                      onChange={() => handleDepartmentChange(dept)}
                      disabled={isLoading}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{dept}</span>
                  </label>
                ))}
              </div>
            </div>
            {formData.departments.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                選択中: {formData.departments.join(', ')}
              </p>
            )}
          </div>

          {/* 医師年数 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              経験年数
            </label>
            <select
              value={formData.yearsOfExperience}
              onChange={(e) =>
                setFormData({ ...formData, yearsOfExperience: e.target.value })
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">選択してください</option>
              <option value="〜5年">〜5年</option>
              <option value="6〜10年">6〜10年</option>
              <option value="11〜20年">11〜20年</option>
              <option value="21年以上">21年以上</option>
            </select>
          </div>

          {/* 保有資格 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              保有している専門医・認定医・その他資格
            </label>
            <textarea
              value={formData.qualifications}
              onChange={(e) =>
                setFormData({ ...formData, qualifications: e.target.value })
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="例: 内科専門医、糖尿病専門医など"
              rows={3}
            />
          </div>
        </>
      )}

      {/* 登録経路 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          登録経路
        </label>
        <select
          value={formData.registrationSource}
          onChange={(e) =>
            setFormData({ ...formData, registrationSource: e.target.value })
          }
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">選択してください</option>
          <option value="検索">検索</option>
          <option value="SNS">SNS</option>
          <option value="紹介">紹介</option>
          <option value="セミナー">セミナー</option>
          <option value="その他">その他</option>
        </select>
      </div>

      {/* 利用規約同意 */}
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
        {isLoading ? '送信中...' : 'ダウンロードする'}
      </button>
    </form>
  )
}
