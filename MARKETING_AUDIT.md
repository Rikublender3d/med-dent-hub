# Med×Dent Hub マーケティング & コード品質 監査レポート

> 作成日: 2026-04-01
> 対象: https://www.ishatohaisha.com (Next.js + microCMS)

---

## 目次

1. [GTM / GA4 設定検証](#1-gtm--ga4-設定検証)
2. [A/Bテスト実装検証](#2-abテスト実装検証)
3. [人気記事ランキング](#3-人気記事ランキング)
4. [フォーム & コンバージョン計測](#4-フォーム--コンバージョン計測)
5. [SEO 検証](#5-seo-検証)
6. [コード品質 (要修正)](#6-コード品質-要修正)
7. [UI/UX 改善提案](#7-uiux-改善提案)
8. [GTM 推奨設定チェックリスト](#8-gtm-推奨設定チェックリスト)
9. [優先度別タスク一覧](#9-優先度別タスク一覧)

---

## 1. GTM / GA4 設定検証

### 現状

| 項目                        | 状態     | ファイル                                        |
| --------------------------- | -------- | ----------------------------------------------- |
| GTM コンテナ読み込み        | OK       | `src/components/analytics/GoogleTagManager.tsx` |
| GTM noscript フォールバック | OK       | 同上 (iframe)                                   |
| GTM ID を env から取得      | OK       | `NEXT_PUBLIC_GTM_ID`                            |
| Script strategy             | OK       | `afterInteractive` で CWV に影響しない          |
| CSP ヘッダー                | OK       | `next.config.ts` で GTM/GA ドメイン許可済み     |
| GA4 Measurement ID          | 設定あり | `NEXT_PUBLIC_GA_ID=G-YV5T1P6JP0`                |

### 要確認 (GTM管理画面で確認すべき項目)

- [ ] **GA4設定タグ**: GTMコンテナ内に GA4 Config Tag が存在し、`G-YV5T1P6JP0` に紐づいているか
- [ ] **ページビュー計測**: All Pages トリガーで GA4 Event Tag (page_view) が発火しているか
- [ ] **Enhanced Measurement**: GA4 管理画面で拡張計測 (スクロール、外部リンク、サイト内検索、動画、ファイルDL) が有効か
- [ ] **クロスドメイン**: `ishatohaisha.com` 以外のドメインに遷移がある場合、クロスドメイン設定されているか
- [ ] **データストリーム**: GA4 にウェブストリームが正しく設定されているか
- [ ] **デバッグモード**: GTM プレビュー & GA4 DebugView で正常にイベントが送信されているか
- [ ] **データ保持期間**: GA4 管理画面 → データ設定 → データ保持 が「14か月」になっているか (デフォルト2か月)

### 問題点

| #   | 問題                                   | 深刻度 | 詳細                                                                                                              |
| --- | -------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| G-1 | Cookie同意バナーが未実装               | HIGH   | GDPR/改正個人情報保護法的にリスク。GTMが無条件で読み込まれる                                                      |
| G-2 | `NEXT_PUBLIC_GA_ID` がコード上で未使用 | LOW    | env に定義あるが、実際は GTM 経由で GA4 を発火している可能性。不要なら削除                                        |
| G-3 | カスタムイベントが少ない               | MED    | `ab_test_view` と `btn_id` のみ。フォーム送信・CTA クリック等の主要コンバージョンがカスタムイベント化されていない |

---

## 2. A/Bテスト実装検証

### 現状のアーキテクチャ

```
ユーザーがトップページにアクセス
    ↓
ABHero (client component) が variant=null でレンダリング → Variant A 表示 (CLS防止)
    ↓
useEffect で Math.random() < 0.5 → variant 'a' or 'b' を決定
    ↓
ABTestTracker が window.gtag('event', 'ab_test_view', { experiment_id, variant }) を送信
    ↓
Variant A: 静的ヒーロー画像 + テキスト
Variant B: 人気記事カルーセル + コンパクトヒーロー
```

**関連ファイル:**

- `src/components/ABHero.tsx` — バリアント分岐
- `src/components/ABTestTracker.tsx` — GA4イベント送信
- `src/components/HeroCarousel.tsx` — Variant B のカルーセルUI
- `src/lib/ab-test.ts` — 型定義のみ

### 問題点

| #    | 問題                               | 深刻度   | 詳細                                                                                                                                                        |
| ---- | ---------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AB-1 | **バリアントが永続化されていない** | CRITICAL | `Math.random()` で毎回ランダム割り当て。同じユーザーが訪問するたびに異なるバリアントが表示され、テスト結果が汚染される。localStorage or Cookie で固定すべき |
| AB-2 | **コンバージョンイベントが未定義** | CRITICAL | `ab_test_view` (インプレッション) のみ追跡。「どのバリアントがCTAクリック/フォーム送信に繋がったか」を計測していない。勝者判定ができない                    |
| AB-3 | **サンプルサイズ計算なし**         | HIGH     | テスト終了条件 (必要サンプル数、期間) が定義されていない。統計的有意性なく結論を出すリスク                                                                  |
| AB-4 | **CLS リスク (Variant B)**         | MED      | variant=null → heroA を表示 → useEffect で variant=b → カルーセルに切り替え。レイアウトシフトが発生する可能性                                               |
| AB-5 | **テスト対象が1つだけ**            | LOW      | hero_carousel のみ。CTAテキスト、フォーム配置、色などもテスト候補                                                                                           |

### 推奨修正

```typescript
// ABHero.tsx — バリアント永続化の例
useEffect(() => {
  const stored = localStorage.getItem('ab_hero_variant')
  if (stored === 'a' || stored === 'b') {
    setVariant(stored)
  } else {
    const v = Math.random() < 0.5 ? 'a' : 'b'
    localStorage.setItem('ab_hero_variant', v)
    setVariant(v)
  }
}, [])
```

---

## 3. 人気記事ランキング

### 現状

| 項目           | 状態                     | 詳細                           |
| -------------- | ------------------------ | ------------------------------ |
| データソース   | GA4 Data API             | `screenPageViews` 過去30日     |
| キャッシュ     | 1時間 TTL (インメモリ)   | `src/lib/analytics/ga4.ts:43`  |
| フォールバック | 最新記事で代替           | GA4 エラー時 or データなし時   |
| 表示箇所       | トップページ、サイドバー | 最大9件 (トップ), 5件 (サイド) |

### 問題点

| #     | 問題                                       | 深刻度 | 詳細                                                                                            |
| ----- | ------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------- |
| POP-1 | **インメモリキャッシュはデプロイで消える** | MED    | Vercel のサーバーレス環境では関数が再起動されるたびキャッシュが消える。Redis or KV ストアを検討 |
| POP-2 | **PVのみでランキング**                     | LOW    | 滞在時間、スクロール率、CVR などの質的指標が考慮されていない                                    |
| POP-3 | **パスフィルタがハードコード**             | LOW    | `/general/` と `/medical-articles/` のみ。新しいエンドポイント追加時に手動修正が必要            |

---

## 4. フォーム & コンバージョン計測

### 現状のフォーム一覧

| フォーム       | エンドポイント   | 送信先                                           | GA4イベント |
| -------------- | ---------------- | ------------------------------------------------ | ----------- |
| お問い合わせ   | `/api/contact`   | GAS + Resend (確認メール×2)                      | **なし**    |
| ニュースレター | `/api/subscribe` | GAS + Resend (セグメント分け + ウェルカムメール) | **なし**    |

### 問題点

| #    | 問題                                        | 深刻度   | 詳細                                                                                                                          |
| ---- | ------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| CV-1 | **フォーム送信のGA4イベントがない**         | CRITICAL | コンバージョン計測の最重要指標が欠落。GTMのフォーム送信自動検出に依存しているが、SPA (Next.js) では動作しない可能性が高い     |
| CV-2 | **ニュースレターバナーのCTAクリック未計測** | HIGH     | `NewsletterBanner.tsx` のリンククリックがイベント化されていない。btn_id は付くが、専用のコンバージョンイベントがない          |
| CV-3 | **セグメント効果が不明**                    | MED      | Resend で `medical` / `general` にセグメント分けしているが、セグメント別の開封率・クリック率を GA4 にフィードバックしていない |
| CV-4 | **Welcome PDF URLがテスト用**               | MED      | `WELCOME_PDF_URL = 'https://www.ishatohaisha.com/pdf_test.pdf'` — `_test` が残っている (`subscribe/route.ts:8`)               |

### 推奨: フォーム送信イベントの追加

```typescript
// ContactForm.tsx — 送信成功時
if (data.success) {
  window.gtag?.('event', 'form_submit', {
    form_name: 'contact',
    form_location: window.location.pathname,
  })
}

// NewsletterForm.tsx — 送信成功時
if (result.success) {
  window.gtag?.('event', 'form_submit', {
    form_name: 'newsletter',
    profession: formData.profession,
    form_location: window.location.pathname,
  })
}
```

GTM側でも `form_submit` イベントを GA4 のコンバージョンとしてマーク。

---

## 5. SEO 検証

### 現状

| 項目                             | 状態       | 詳細                                              |
| -------------------------------- | ---------- | ------------------------------------------------- |
| メタデータ (title / description) | OK         | layout.tsx でテンプレート設定、各ページで動的生成 |
| OGP (OpenGraph)                  | OK         | type, image (1200x630), locale ja_JP              |
| Twitter Card                     | OK         | summary_large_image                               |
| sitemap.xml                      | OK         | 動的生成、1時間ごとrevalidate                     |
| robots.txt                       | OK         | `/draft/` をDisallow                              |
| 構造化データ (JSON-LD)           | **未実装** | —                                                 |
| canonical URL                    | 要確認     | Next.js デフォルトに依存                          |
| LLMs.txt                         | 実装済み   | `feat:add llm txt` コミットあり                   |

### 問題点

| #     | 問題                           | 深刻度 | 詳細                                                                                                                      |
| ----- | ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| SEO-1 | **JSON-LD 構造化データがない** | HIGH   | 記事ページに `Article` / `MedicalWebPage` スキーマがない。Google検索結果のリッチスニペット表示に必要                      |
| SEO-2 | **metadataBase がVercel URL**  | MED    | `layout.tsx` で `metadataBase: new URL('https://med-dent-hub.vercel.app')` — 本番ドメイン `ishatohaisha.com` に変更すべき |
| SEO-3 | **alt属性の質**                | LOW    | 画像の alt が `article.title` のみで、視覚的な内容の説明になっていない場合がある                                          |

### 推奨: JSON-LD の追加 (記事ページ)

```typescript
// general/[id]/page.tsx に追加
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  image: article.eyecatch?.url,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  author: { '@type': 'Organization', name: '医者と歯医者の交換日記' },
  publisher: { '@type': 'Organization', name: '医者と歯医者の交換日記' },
}

// <head> 内に
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

---

## 6. コード品質 (要修正)

### CRITICAL

| #   | 問題                                                          | ファイル                 | 行     |
| --- | ------------------------------------------------------------- | ------------------------ | ------ |
| C-1 | **Google Apps Script URL がハードコード**                     | `api/subscribe/route.ts` | L70-71 |
|     | env 未設定時のフォールバックにフルURLが露出。env 必須にすべき |                          |        |

### HIGH

| #   | 問題                                                                                           | ファイル                 | 行                     |
| --- | ---------------------------------------------------------------------------------------------- | ------------------------ | ---------------------- |
| C-2 | **本番にデバッグ console.log が大量に残存**                                                    | `api/contact/route.ts`   | L38-40, 55-63, 95, 110 |
|     | `console.log('Script URL:', scriptUrl)` でURLがログに露出                                      |                          |                        |
| C-3 | **XSS脆弱性: confirmHtml で未エスケープ**                                                      | `api/contact/route.ts`   | L121                   |
|     | `body.subject` が `escapeHtml()` なしで埋め込み。adminHtml (L132) では escape してるのに不整合 |                          |                        |
| C-4 | **メールバリデーションがない (バックエンド)**                                                  | `api/subscribe/route.ts` | L59-64                 |
|     | `typeof email !== 'string'` のみ。正規表現 or zod でフォーマット検証すべき                     |                          |                        |
| C-5 | **レート制限がない**                                                                           | 両APIルート              | —                      |
|     | スパム送信し放題。Vercel Edge の rate limit or upstash/ratelimit 導入推奨                      |                          |                        |

### MEDIUM

| #    | 問題                               | ファイル                      | 行             |
| ---- | ---------------------------------- | ----------------------------- | -------------- |
| C-6  | メール送信失敗がサイレント         | `api/contact/route.ts`        | L128-142       |
| C-7  | `alert()` でエラー表示 (UX悪い)    | `forms/NewsletterForm.tsx`    | L27-28, 49, 53 |
| C-8  | フォーム状態管理の命名が不統一     | ContactForm vs NewsletterForm | —              |
| C-9  | `publishedAt` の null チェックなし | `ArticleSidebar.tsx`          | L158           |
| C-10 | インラインの型定義が長い           | `api/subscribe/route.ts`      | L46-57         |

---

## 7. UI/UX 改善提案

| #    | 提案                                                                             | 対象                   | 優先度 |
| ---- | -------------------------------------------------------------------------------- | ---------------------- | ------ |
| UX-1 | **ニュースレターバナー → Cookieベースの非表示制御**                              | `NewsletterBanner.tsx` | HIGH   |
|      | 閉じても再訪問で復活する。localStorage で「閉じた」状態を記憶すべき              |                        |        |
| UX-2 | **フォーム送信後のフィードバック統一**                                           | 全フォーム             | HIGH   |
|      | ContactForm は状態表示、NewsletterForm は `alert()` → Toast通知に統一            |                        |        |
| UX-3 | **カルーセルのアクセシビリティ**                                                 | `HeroCarousel.tsx`     | MED    |
|      | `aria-live="polite"` でスライド切り替えを通知、キーボード操作対応                |                        |        |
| UX-4 | **サイドバーPromoバナーの表示条件**                                              | `ArticleSidebar.tsx`   | MED    |
|      | 既にニュースレター登録済みユーザーにも表示される。Cookie/localStorage で出し分け |                        |        |
| UX-5 | **CTAボタンの色・テキストのA/Bテスト**                                           | 各CTA                  | LOW    |
|      | ヒーローだけでなく、主要CTAもテスト対象にすべき                                  |                        |        |
| UX-6 | **ローディングスケルトンの追加**                                                 | 記事一覧ページ         | LOW    |
|      | Suspense fallback のスケルトンをより具体的な形状にする                           |                        |        |

---

## 8. GTM 推奨設定チェックリスト

GTM管理画面で以下を設定・確認すること。

### タグ

- [ ] **GA4 設定タグ** — Measurement ID: `G-YV5T1P6JP0`
- [ ] **GA4 イベント: page_view** — All Pages トリガー
- [ ] **GA4 イベント: form_submit** — カスタムイベントトリガー (※コード側実装が前提)
- [ ] **GA4 イベント: ab_test_view** — カスタムイベントトリガー (既存)
- [ ] **GA4 イベント: newsletter_cta_click** — ニュースレターバナー Click トリガー
- [ ] **GA4 イベント: scroll_depth** — スクロール深度 (25/50/75/100%)
- [ ] **GA4 イベント: file_download** — PDF ダウンロードリンク Click トリガー

### トリガー

- [ ] **All Pages** — ページビュー
- [ ] **Custom Event: form_submit** — dataLayer or gtag イベント
- [ ] **Custom Event: ab_test_view** — 既存
- [ ] **Click: newsletter CTA** — CSS セレクタ or data-location 属性
- [ ] **Scroll Depth** — 25/50/75/100% thresholds
- [ ] **Click: PDF download** — URL contains `.pdf`

### 変数

- [ ] **データレイヤー変数: form_name** — フォーム識別用
- [ ] **データレイヤー変数: experiment_id** — A/Bテスト識別用
- [ ] **データレイヤー変数: variant** — A/Bテストバリアント
- [ ] **URL クエリパラメータ: btn_id** — ボタンID追跡用

### GA4 コンバージョン設定

GA4 管理画面 → イベント → コンバージョンとしてマーク:

- [ ] `form_submit` (form_name = 'contact')
- [ ] `form_submit` (form_name = 'newsletter')
- [ ] `newsletter_cta_click`
- [ ] `file_download`

---

## 9. 優先度別タスク一覧

### P0: 今すぐ修正 (セキュリティ・データ品質)

| タスク                                               | 関連issue |
| ---------------------------------------------------- | --------- |
| XSS修正: `confirmHtml` で `escapeHtml()` 適用        | C-3       |
| GAS URL のハードコード削除、env 必須化               | C-1       |
| `api/contact/route.ts` のデバッグ console.log 全削除 | C-2       |
| A/Bテストのバリアント永続化 (localStorage)           | AB-1      |
| フォーム送信 GA4 イベント追加                        | CV-1      |

### P1: 今週中に対応 (マーケティング効果)

| タスク                                 | 関連issue  |
| -------------------------------------- | ---------- |
| コンバージョンイベント定義 & GTM設定   | CV-1, CV-2 |
| A/Bテストにコンバージョン計測を追加    | AB-2       |
| JSON-LD 構造化データの追加             | SEO-1      |
| metadataBase を本番ドメインに変更      | SEO-2      |
| バックエンドにメールバリデーション追加 | C-4        |
| Welcome PDF URL を本番用に変更         | CV-4       |
| Cookie同意バナーの実装                 | G-1        |

### P2: 今月中に対応 (UX・安定性)

| タスク                                                 | 関連issue |
| ------------------------------------------------------ | --------- |
| `alert()` → Toast通知コンポーネントに置換              | C-7, UX-2 |
| ニュースレターバナーの非表示状態を localStorage で記憶 | UX-1      |
| API レート制限の導入                                   | C-5       |
| 人気記事キャッシュを KV ストアに移行                   | POP-1     |
| カルーセルのアクセシビリティ改善                       | UX-3      |

### P3: 余裕があれば (品質向上)

| タスク                                     | 関連issue  |
| ------------------------------------------ | ---------- |
| フォームの命名規則統一                     | C-8        |
| API レスポンス構造の標準化                 | C-6, C-10  |
| CTA テキスト/色の A/B テスト追加           | UX-5, AB-5 |
| スクロール深度トラッキング設定             | GTM推奨    |
| Resend セグメント効果の GA4 フィードバック | CV-3       |

---

## 補足: 環境変数一覧

```
# Analytics
NEXT_PUBLIC_GTM_ID          # GTMコンテナID
NEXT_PUBLIC_GA_ID           # GA4測定ID (※現在未使用の可能性)
GA4_PROPERTY_ID             # GA4プロパティID (Data API用)
GA4_SERVICE_ACCOUNT_EMAIL   # サービスアカウント
GA4_SERVICE_ACCOUNT_KEY     # サービスアカウント秘密鍵

# Email (Resend)
RESEND_API_KEY
RESEND_FROM
CONTACT_NOTIFY_TO
RESEND_SEGMENT_GENERAL
RESEND_SEGMENT_MEDICAL

# Forms
APPS_SCRIPT_URL             # Contact用 GAS
SUBSCRIBE_SCRIPT_URL        # Newsletter用 GAS

# CMS
MICROCMS_SERVICE_DOMAIN
MICROCMS_API_KEY

# Site
BASE_URL
```
