# GA4・Google Analytics のテスト手順

このプロジェクトでは **Google Tag Manager（GTM）** 経由で **GA4** にデータを送っています。テストは「ブラウザ側（サイトで計測が動いているか）」と「サーバー側（GA4 Data API でデータを読めるか）」の2通りがあります。

---

## クイックスタート

**ブラウザで「計測が動いているか」だけ確認する**

1. `npm run dev` でサイトを開く
2. [アナリティクス](https://analytics.google.com/) → 該当プロパティ → **レポート** → **リアルタイム** を開く
3. サイト側で数ページ遷移する → リアルタイムで「アクティブなユーザー」が 1 以上になれば OK

**Data API で「データを読めるか」確認する**

1. `.env.local` に `GA4_PROPERTY_ID`・`GA_CLIENT_EMAIL`・`GA_PRIVATE_KEY` を設定
2. `npm install dotenv @google-analytics/data` を実行
3. `node scripts/testGA4.js` を実行 → 「✅ 接続成功！」が出れば OK

---

## 前提：環境変数

| 変数名               | 用途                                 | 使う場所                                     |
| -------------------- | ------------------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_GTM_ID` | GTM コンテナ ID（例: `GTM-XXXXXXX`） | サイトに GTM を埋め込む（layout）            |
| `NEXT_PUBLIC_GA_ID`  | GA4 測定 ID（例: `G-XXXXXXXXXX`）    | 参照用。実際の送信は GTM 内の GA4 タグで設定 |
| `GA4_PROPERTY_ID`    | GA4 プロパティの数値 ID              | サーバー側スクリプト（Data API）             |
| `GA_CLIENT_EMAIL`    | サービスアカウントのメール           | 同上（Data API 認証）                        |
| `GA_PRIVATE_KEY`     | サービスアカウントの秘密鍵           | 同上（Data API 認証）                        |

`.env.local` に上記を設定しておいてください。Data API 用の `GA_CLIENT_EMAIL` と `GA_PRIVATE_KEY` は、Google Cloud でサービスアカウントを作成し、GA4 プロパティで「表示アナリティクス」権限を付与したうえで取得します。

---

## 1. ブラウザ側のテスト（サイトで GA4 が動いているか）

サイトにアクセスしたときに GTM → GA4 が発火しているかを確認します。

### 1-1. 開発サーバーで確認

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、以下を確認します。

### 1-2. GTM が読み込まれているか

1. ブラウザの開発者ツール（F12）を開く
2. **Console** で `dataLayer` と入力して Enter  
   → 配列が表示され、中身があれば GTM は読み込まれている
3. **Network** タブで `gtm.js` または `googletagmanager.com` でフィルタ  
   → リクエストが 200 で返っていれば GTM スクリプトは読み込み済み

### 1-3. GA4 のリアルタイムレポート

1. [Google アナリティクス](https://analytics.google.com/) を開く
2. 該当の GA4 プロパティを選択
3. 左メニュー **「レポート」→「リアルタイム」** を開く
4. 別タブでサイト（本番 URL または localhost）を開き、数ページ遷移する
5. リアルタイム画面で「過去 30 分間にアクティブなユーザー」が 1 以上になれば、GA4 にイベントが届いている

※ localhost は「参照元」が `localhost` などで出ます。本番ドメインでテストしたい場合は、本番またはステージングの URL で同様にアクセスして確認します。

### 1-4. Google タグ アシスタント（推奨）

1. Chrome に [Tag Assistant Legacy](https://chromewebstore.google.com/detail/tag-assistant-legacy-by-go/kejbdjndbnbjgmefkgdddjlbokphdefk) または [Google タグ アシスタント](https://tagassistant.google.com/) を入れる
2. サイトを開いた状態でアシスタントを起動
3. GTM と GA4 タグが「発火」しているか、エラーがないかを確認

---

## 2. サーバー側のテスト（GA4 Data API でデータを読めるか）

スクリプト `scripts/testGA4.js` で、GA4 に蓄積されたデータを Data API 経由で取得できるかをテストします。

### 2-1. 依存パッケージのインストール

スクリプトは `@google-analytics/data` と `dotenv` を使います。

```bash
npm install dotenv @google-analytics/data
```

（`dotenv` はすでに別用途で入っている場合はそのままで問題ありません。）

### 2-2. 環境変数の設定

`.env.local` に以下が入っていることを確認します。

- `GA4_PROPERTY_ID` … GA4 の「管理」→「プロパティ設定」にある「プロパティ ID」（数値のみ、例: `512349629`）
- `GA_CLIENT_EMAIL` … サービスアカウントのメールアドレス
- `GA_PRIVATE_KEY` … サービスアカウントの秘密鍵（`-----BEGIN PRIVATE KEY-----` ～ `-----END PRIVATE KEY-----`）。改行は `\n` のままでも、実際の改行に置き換えてもスクリプト側で対応しています。

### 2-3. サービスアカウントと GA4 の権限

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを選択
2. **IAM と管理** → **サービス アカウント** でサービスアカウントを作成し、JSON キーをダウンロード
3. [Google アナリティクス](https://analytics.google.com/) → 該当 GA4 プロパティの **管理** → **プロパティのアクセス管理**
4. サービスアカウントのメールを追加し、権限 **「表示アナリティクス」** を付与

### 2-4. スクリプトの実行

```bash
node scripts/testGA4.js
```

- 成功時: 「✅ 接続成功！」と、直近 7 日間の `/articles/` の PV サンプルが表示されます
- データが 0 件: GA4 にまだデータが溜まっていないか、フィルタ条件（`/articles/` で始まるページ）に合うアクセスがない可能性があります
- エラー: 環境変数不足・権限不足・プロパティ ID 誤りなどを確認してください

### 2-5. 中身のカスタム（任意）

`scripts/testGA4.js` 内の `runReport` で、`dateRanges`・`dimensions`・`metrics`・`dimensionFilter` を変えると、別の期間や指標でテストできます。  
例: `dimensionFilter` を外せば「全ページ」の PV を取得できます。

---

## 3. チェックリスト（テスト時）

| 項目                       | 確認方法                                                   |
| -------------------------- | ---------------------------------------------------------- |
| GTM が読み込まれている     | 開発者ツール Console で `dataLayer` を表示                 |
| GA4 にイベントが届いている | アナリティクス「リアルタイム」でアクティブユーザーが増える |
| Data API でデータを読める  | `node scripts/testGA4.js` が成功する                       |
| 本番・ステージングでも動く | 本番/ステージング URL で上記を同様に確認                   |

---

## 4. よくあるトラブル

- **リアルタイムに自分が出ない**
  - 広告ブロッカーや Cookie 無効で GA がブロックされていないか確認
  - GTM の GA4 タグで「設定変数」の測定 ID が正しいか確認
- **testGA4.js で「権限がない」**
  - GA4 の「プロパティのアクセス管理」でサービスアカウントに「表示アナリティクス」が付いているか確認
- **「データがありません」**
  - 直近 7 日間に `/articles/` で始まるページの閲覧があるか確認
  - フィルタを外して全ページで試す（`dimensionFilter` を削除またはコメントアウト）
