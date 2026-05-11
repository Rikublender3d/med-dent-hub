// ============================================================
//  Vercel アカウント移行 仕様書
//  個人アカウント A → 個人アカウント B（1から再セットアップ）
//  med-dent-hub プロジェクト
//  作成日: 2026-05-07
// ============================================================

#set document(
  title: "Vercel アカウント移行 仕様書",
  author: "天野実来 (Pocky)",
)

#set page(
  paper: "a4",
  margin: (top: 25mm, bottom: 25mm, left: 22mm, right: 22mm),
  header: [
    #set text(size: 8pt, fill: rgb("#888"))
    #grid(
      columns: (1fr, 1fr),
      align(left)[med-dent-hub / Vercel 移行仕様書],
      align(right)[v1.0 — 2026-05-07],
    )
    #line(length: 100%, stroke: 0.5pt + rgb("#ddd"))
  ],
  footer: [
    #line(length: 100%, stroke: 0.5pt + rgb("#ddd"))
    #set text(size: 8pt, fill: rgb("#888"))
    #align(center)[#context counter(page).display("1 / 1", both: true)]
  ],
)

#set text(font: "Hiragino Kaku Gothic Pro", size: 10.5pt, lang: "ja")
#set heading(numbering: "1.1")
#set par(leading: 0.85em, justify: true)

#let accent = rgb("#0070f3")
#let danger = rgb("#e53e3e")
#let warn   = rgb("#d97706")
#let ok     = rgb("#16a34a")
#let bg-light = rgb("#f8f9fa")

#let badge(color, label) = box(
  fill: color.lighten(80%),
  stroke: 0.5pt + color,
  radius: 3pt,
  inset: (x: 5pt, y: 2pt),
  text(size: 8pt, fill: color, weight: "bold", label),
)

#let callout(icon, color, body) = block(
  width: 100%,
  fill: color.lighten(90%),
  stroke: (left: 3pt + color),
  inset: (x: 12pt, y: 10pt),
  radius: (right: 4pt),
)[#text(fill: color, weight: "bold")[#icon] #body]

// ============================================================
//  タイトル
// ============================================================

#v(20mm)
#align(center)[
  #block(
    fill: accent, radius: 8pt,
    inset: (x: 20pt, y: 14pt),
    text(fill: white, size: 28pt, weight: "bold", tracking: 1pt)[▲ Vercel],
  )
  #v(8mm)
  #text(size: 22pt, weight: "bold")[アカウント移行 仕様書]
  #v(3mm)
  #text(size: 13pt, fill: rgb("#555"))[med-dent-hub — 個人アカウント間 完全再セットアップ]
  #v(10mm)
  #grid(
    columns: (auto, auto), column-gutter: 8pt, row-gutter: 5pt,
    align(right, text(fill: rgb("#777"), size: 9pt)[ステータス]), badge(warn, "Draft"),
    align(right, text(fill: rgb("#777"), size: 9pt)[バージョン]), text(size: 9pt)[1.0],
    align(right, text(fill: rgb("#777"), size: 9pt)[作成日]),     text(size: 9pt)[2026-05-07],
    align(right, text(fill: rgb("#777"), size: 9pt)[作成者]),     text(size: 9pt)[天野実来 (Pocky)],
  )
]

#v(12mm)
#line(length: 100%, stroke: 1pt + rgb("#e0e0e0"))
#v(5mm)

#callout("📋", accent)[
  *概要:* Pocky の個人 Vercel アカウント（旧）から別の個人 Vercel アカウント（新）へ、
  1 からすべて再セットアップして移行する。
  Vercel の Transfer 機能は*使わない*。GitHub リポジトリを新アカウントに再接続し、
  環境変数・ドメイン・設定をすべて手動で再構築する。
]

#pagebreak()

// ============================================================
//  1. 移行方針
// ============================================================

= 移行方針

== なぜ「1から再セットアップ」か

Vercel の Transfer 機能は「同一ユーザーが両アカウントの権限を持つ」ことが前提。
今回は別の個人アカウントへの完全移管であるため、シンプルに新アカウントで
プロジェクトをゼロから作り直す方針を採用する。

#v(2mm)
#callout("✅", ok)[
  *この方針のメリット:* 手順がシンプル / 旧アカウントへの依存が残らない /
  新アカウントで綺麗な状態からスタートできる
]
#callout("⚠️", warn)[
  *この方針のデメリット:* デプロイ履歴・ログは引き継がれない /
  ドメイン切り替え時に数分の空白が発生しうる
]

== 移行対象

#block(
  fill: bg-light, radius: 6pt, inset: 14pt, width: 100%,
)[
  #grid(
    columns: (auto, 1fr), column-gutter: 12pt, row-gutter: 6pt,
    text(fill: rgb("#666"), size: 9pt)[プロジェクト名],   [med-dent-hub],
    text(fill: rgb("#666"), size: 9pt)[フレームワーク],   [Next.js（App Router）],
    text(fill: rgb("#666"), size: 9pt)[ドメイン],         [`ishatohaisha.com`],
    text(fill: rgb("#666"), size: 9pt)[リポジトリ],       [GitHub（リポジトリ自体は変更なし）],
    text(fill: rgb("#666"), size: 9pt)[環境],             [Production / Staging],
    text(fill: rgb("#666"), size: 9pt)[外部連携],
    [microCMS / Resend / Google Analytics（GA4）/ GTM / Google Apps Script],
  )
]

// ============================================================
//  コードの修正が必要な箇所
// ============================================================

= 移行前に直すべきコードの問題

#callout("🔍", danger)[
  以下はコードベース調査で発見した問題。移行と同時に修正することを推奨。
]

#v(3mm)
#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#ddd"),
  fill: (_, row) => if row == 0 { bg-light } else { white },
  inset: 9pt,
  [*ファイル*], [*問題*], [*優先度*],
  [`src/app/layout.tsx:33,38`],
  [`metadataBase` と OGP の `url` が `med-dent-hub.vercel.app` にハードコード。\
   `https://www.ishatohaisha.com` に修正すること],
  badge(danger, "High"),
  [`.vercel/project.json`],
  [`projectId` と `orgId` が旧アカウントに紐づいている。\
   移行後に `vercel link` を実行して新プロジェクトに再リンクする],
  badge(danger, "High"),
  [`src/app/api/subscribe/route.ts:72`],
  [`SUBSCRIBE_SCRIPT_URL` が env var なしでスクリプト URL をハードコード。\
   `.env` に `SUBSCRIBE_SCRIPT_URL` を追加して env var 経由に統一する],
  badge(warn, "Medium"),
)

// ============================================================
//  GitHub Actions の更新
// ============================================================

= GitHub Actions Secrets の更新

`.github/workflows/staging.yml` は Vercel アカウント固有の Secrets を使用している。
移行後に GitHub リポジトリの Secrets を新アカウントの値に更新する必要がある。

#v(3mm)
#table(
  columns: (1fr, 1fr),
  stroke: 0.5pt + rgb("#ddd"),
  fill: (_, row) => if row == 0 { bg-light } else { white },
  inset: 9pt,
  [*GitHub Secret 名*], [*取得場所*],
  [`VERCEL_TOKEN`],      [新アカウント: Account Settings → Tokens → Create Token],
  [`VERCEL_ORG_ID`],    [新プロジェクト作成後の `.vercel/project.json` → `orgId`],
  [`VERCEL_PROJECT_ID`],[新プロジェクト作成後の `.vercel/project.json` → `projectId`],
)

#callout("📌", accent)[
  上記 3 つを GitHub リポジトリの Settings → Secrets and variables → Actions で更新すること。
  更新しないと `develop` ブランチへの push 時に Staging デプロイが失敗する。
]

// ============================================================
//  外部サービスの影響範囲
// ============================================================

= 外部サービスへの影響

#v(3mm)
#table(
  columns: (auto, auto, 1fr),
  stroke: 0.5pt + rgb("#ddd"),
  fill: (_, row) => if row == 0 { bg-light } else { white },
  inset: 9pt,
  [*サービス*], [*影響*], [*対応*],
  [Resend],
  badge(ok, "影響なし"),
  [ドメイン認証（DKIM/SPF）は DNS レコードなので Vercel 無関係。env var の再設定のみ],
  [microCMS],
  badge(ok, "影響なし"),
  [env var（API キー・ドメイン）の再設定のみ。Webhook なし],
  [Google Analytics / GTM],
  badge(ok, "影響なし"),
  [計測 ID は env var。Vercel に紐づいていない],
  [Google Apps Script],
  badge(ok, "影響なし"),
  [Apps Script の URL 自体は変わらない。env var の再設定のみ],
  [GitHub Actions],
  badge(danger, "要対応"),
  [`VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` を新アカウント値に更新],
)

// ============================================================
//  2. 環境変数一覧
// ============================================================

= 移行対象：環境変数一覧

新アカウントで設定し直す必要があるすべての環境変数。

#v(3mm)
#table(
  columns: (1fr, auto, auto),
  stroke: 0.5pt + rgb("#ddd"),
  fill: (_, row) => if row == 0 { bg-light } else { white },
  inset: 9pt,
  [*変数名*], [*用途*], [*確認*],
  [`MICROCMS_SERVICE_DOMAIN`], [microCMS ドメイン],           [☐],
  [`MICROCMS_API_KEY`],        [microCMS API キー],           [☐],
  [`RESEND_API_KEY`],          [メール送信 API キー],         [☐],
  [`RESEND_FROM`],             [送信元メールアドレス],        [☐],
  [`RESEND_SEGMENT_GENERAL`],  [Resend セグメント ID（全体）],[☐],
  [`RESEND_SEGMENT_MEDICAL`],  [Resend セグメント ID（医療）],[☐],
  [`CONTACT_NOTIFY_TO`],       [問い合わせ通知先メール],      [☐],
  [`NEXT_PUBLIC_GA_ID`],       [Google Analytics 計測 ID],    [☐],
  [`NEXT_PUBLIC_GTM_ID`],      [Google Tag Manager ID],       [☐],
  [`GA4_PROPERTY_ID`],         [GA4 プロパティ ID],           [☐],
  [`GA4_SERVICE_ACCOUNT_EMAIL`],[GA4 サービスアカウント],     [☐],
  [`GA4_SERVICE_ACCOUNT_KEY`], [GA4 秘密鍵 JSON *（要確認）*],[☐],
  [`APPS_SCRIPT_URL`],            [Google Apps Script（お問い合わせ）URL],[☐],
  [`SUBSCRIBE_SCRIPT_URL`],       [Google Apps Script（メルマガ登録）URL *← 新規追加*],[☐],
  [`BASE_URL`],                   [本番 URL（`https://www.ishatohaisha.com`）],[☐],
)

#callout("⚠️", warn)[
  `GA4_SERVICE_ACCOUNT_KEY`（秘密鍵 JSON）が Vercel 環境変数に入っているかを
  *事前に必ず確認*すること。入っている場合はバックアップしてから新アカウントに設定。
]

// ============================================================
//  3. 作業ステップ
// ============================================================

= 作業ステップ

#let step(n, title, detail) = block(width: 100%, inset: (bottom: 6pt))[
  #grid(
    columns: (28pt, 1fr), column-gutter: 8pt,
    align(center + top, box(
      fill: accent, radius: 14pt,
      inset: (x: 6pt, y: 4pt),
      text(fill: white, weight: "bold", size: 9pt)[#n],
    )),
    block[
      #text(weight: "bold")[#title]
      #v(2pt)
      #text(size: 9.5pt, fill: rgb("#444"))[#detail]
    ],
  )
  #line(length: 100%, stroke: 0.5pt + rgb("#eee"))
]

#step("1", "事前バックアップ（旧アカウントで作業）",
  list(
    [旧 Vercel ダッシュボードで環境変数をすべてメモ or スクリーンショット],
    [上記テーブルの全変数を `.env.migration`（gitignore 済み）に保存],
    [GA4 秘密鍵 JSON が Vercel 環境変数にあれば安全な場所にコピー],
    [現在のビルド設定（Build Command / Output Dir）をメモ],
    [Vercel の Custom Domain 設定画面をスクリーンショット（DNS 設定確認用）],
  )
)

#step("2", "新アカウントで GitHub 連携・プロジェクト作成",
  list(
    [新 Vercel アカウントにログイン],
    [「Add New Project」→ GitHub を連携],
    [`med-dent-hub` リポジトリを選択してインポート],
    [Framework: Next.js を確認],
    [*まだ Deploy しない*（環境変数を先に設定する）],
  )
)

#step("3", "環境変数を新プロジェクトに設定",
  list(
    [Project Settings → Environment Variables],
    [上記テーブルの全変数を Production / Preview / Development に設定],
    [`BASE_URL` は本番用に `https://ishatohaisha.com` を設定],
    [GA4 秘密鍵 JSON は JSON 全体を 1 つの変数値として貼り付け],
    [設定完了後、テスト Deploy を 1 回走らせて build エラーがないか確認],
  )
)

#step("4", "ドメインの切り替え",
  list(
    [*旧アカウント:* ishatohaisha.com のプロジェクト Settings → Domains → ドメインを削除],
    [*新アカウント:* Project Settings → Domains → `ishatohaisha.com` を追加],
    [DNS の A レコード / CNAME が Vercel を向いていれば自動で反映（数分以内）],
    [反映確認: `dig ishatohaisha.com` または Vercel 管理画面のステータス確認],
  )
)

#callout("⏱️", accent)[
  ドメイン削除〜新アカウントで追加の間、*最大数分のダウンタイムが発生しうる*。
  深夜や早朝（アクセスが少ない時間帯）に実施することを推奨。
]

#step("5", "ローカル環境を新プロジェクトに再リンク",
  list(
    [ローカルのプロジェクトルートで `vercel link` を実行],
    [新アカウント・新プロジェクトを選択],
    [`.vercel/project.json` の `projectId`/`orgId` が更新されたことを確認],
    [GitHub Secrets の `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` / `VERCEL_TOKEN` を新アカウント値に更新],
  )
)

#step("6", "動作確認（チェックリスト）",
  list(
    [`ishatohaisha.com` が表示される],
    [microCMS のコンテンツが正常に表示される],
    [お問い合わせフォームでテスト送信 → メールが届く],
    [GitHub に push → 自動デプロイが走る],
    [Staging 環境 URL が機能する（使っている場合）],
    [GA4 のリアルタイムレポートで自分のアクセスが取れる],
    [GTM プレビューモードで正常動作する],
  )
)

#step("7", "旧アカウントのクリーンアップ",
  list(
    [すべての動作確認が完了してから旧プロジェクトを削除],
    [旧アカウントで取っておいた `.env.migration` ファイルを削除（git 管理外）],
    [旧アカウントに残す必要がなければ、GitHub 連携も解除],
  )
)

// ============================================================
//  4. リスクと対策
// ============================================================

= リスクと対策

#table(
  columns: (1fr, auto, 1fr),
  stroke: 0.5pt + rgb("#ddd"),
  fill: (_, row) => if row == 0 { bg-light } else { white },
  inset: 9pt,
  [*リスク*], [*深刻度*], [*対策*],
  [ドメイン切り替え時のダウンタイム],
  badge(warn, "中"),
  [深夜に実施 / 削除〜追加を素早く連続実行],
  [環境変数の設定漏れ・typo],
  badge(danger, "高"),
  [Step 1 でバックアップした値と照合してから Deploy],
  [GA4 秘密鍵 JSON の紛失],
  badge(danger, "高"),
  [Step 1 で必ず安全な場所にバックアップ],
  [新アカウントで GitHub の権限エラー],
  badge(warn, "中"),
  [リポジトリの権限設定を確認 / Vercel GitHub App の再インストール],
  [build エラー（旧環境との差異）],
  badge(warn, "中"),
  [Step 3 で本番ドメイン設定前に先に 1 回 Deploy して確認],
)

// ============================================================
//  5. 確認事項
// ============================================================

= 移行前に確認すること

#callout("❓", warn)[
  以下を事前に確認してから作業を開始する。
]

#list(
  [*新アカウントの GitHub 連携方法:* 同じ GitHub アカウントに両方の Vercel アカウントを連携できるか？ → できる（Vercel GitHub App で複数アカウント管理可）],
  [*GA4 秘密鍵 JSON:* 現在の Vercel 環境変数に入っているか？ → 旧ダッシュボードで確認],
  [*Staging 環境の URL:* Staging に使っているプレビュー URL や branch を把握しているか？],
  [*その他の連携:* Slack 通知・Sentry・Datadog など Vercel Integration を使っているか？],
)

#v(10mm)
#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))
#v(3mm)
#align(center, text(size: 8.5pt, fill: rgb("#999"))[
  このドキュメントは Draft です。実行前に確認事項を解消してください。
])
