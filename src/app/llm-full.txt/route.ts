// app/llm-full.txt/route.ts
// LLM向け全文ドキュメント。全ページ・全記事の内容を含む。
import { client } from '@/lib/microCMS/microcms'
import type {
  ArticleResponse,
  CategoryResponse,
  TagResponse,
} from '@/types/microcms'

const BASE_URL = process.env.BASE_URL ?? 'https://www.ishatohaisha.com'

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET() {
  const [generalRes, medicalRes, categoriesRes, tagsRes] = await Promise.all([
    client.get<ArticleResponse>({
      endpoint: 'general',
      queries: { limit: 100, orders: '-publishedAt', depth: 2 },
    }),
    client.get<ArticleResponse>({
      endpoint: 'medical-articles',
      queries: { limit: 100, orders: '-publishedAt', depth: 2 },
    }),
    client.get<CategoryResponse>({
      endpoint: 'categories',
      queries: { limit: 100 },
    }),
    client.get<TagResponse>({ endpoint: 'tags', queries: { limit: 100 } }),
  ])

  const categories = categoriesRes.contents
  const tags = tagsRes.contents
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const articleBlock = (
    a: (typeof generalRes.contents)[0],
    endpoint: 'general' | 'medical-articles'
  ) => {
    const url = `${BASE_URL}/${endpoint}/${a.id}`
    const meta = [
      formatDate(a.publishedAt),
      a.category?.name,
      a.tags?.map((t) => t.name).join(', '),
    ]
      .filter(Boolean)
      .join(' | ')
    const body = a.content ? stripHtml(a.content) : (a.description ?? '')
    return `
### [${a.title}](${url})
${meta}

${body}
`
  }

  const parts: string[] = []

  // === ヘッダー ===
  parts.push(`# 医者と歯医者の交換日記 - 全文ドキュメント

> 医療の明日を、現場からよくする。医科歯科連携の判断に迷う場面で役立つ「現場で使える視点」をまとめたメディアです。
> 要約版: [llm.txt](${BASE_URL}/llm.txt)

---

## 目次

1. サイト概要・主要ページ
2. このサイトについて（about）
3. お問い合わせ（contact）
4. 資料ダウンロード（newsletter）
5. プライバシーポリシー（privacy）
6. 利用規約（terms）
7. 一般向け記事（全文）
8. 医療従事者向け記事（全文）

---

## 1. サイト概要・主要ページ

| ページ | URL |
|--------|-----|
| ホーム | ${BASE_URL}/ |
| 全記事一覧 | ${BASE_URL}/articles |
| 一般向け記事 | ${BASE_URL}/general |
| 医療従事者向け | ${BASE_URL}/medical-articles |
| 検索 | ${BASE_URL}/search |
| このサイトについて | ${BASE_URL}/about |
| お問い合わせ | ${BASE_URL}/contact |
| 資料ダウンロード | ${BASE_URL}/newsletter |
| プライバシーポリシー | ${BASE_URL}/privacy |
| 利用規約 | ${BASE_URL}/terms |

### カテゴリ
${categories.map((c) => `- [${c.name}](${BASE_URL}/articles?category=${c.id})`).join('\n')}

### タグ
${tags.map((t) => `- [${t.name}](${BASE_URL}/articles?tag=${t.id})`).join('\n')}

---

## 2. このサイトについて

URL: ${BASE_URL}/about

医者と歯医者の交換日記は、医科歯科連携の判断に迷う場面で役立つ「現場で使える視点」をまとめたメディアです。医師・歯科医師、そして患者さんやそのご家族の判断を支える情報を発信します。

### このサイトについて
「医科と歯科のあいだにある見えないすきま」を埋めるために生まれたメディアです。

### はじめに
口の変化が、血糖値の変動や心臓への負担にまで影響するのを知っていますか。口腔と全身は密接につながっていますが、この関係性は医療者でも患者でも、十分に共有されていないのが現状です。

たとえば、歯周病が血糖コントロールに影響する、誤嚥性肺炎を予防するために歯科ケアが欠かせない、持病のある患者さんへの歯科治療に医科の確認が必要になる、といったことがあります。

外来・病棟・在宅のどの現場でも、「もう医科だけ、歯科だけでは完結しない」ケースが確実に増えています。一方で、連携したいけどどのタイミングで共有すべきか迷う、持病のある患者さんの歯科治療ってどこまで安全なの、在宅の情報共有が院ごとにバラバラで困っている、といった声も聞かれます。

患者やご家族も「医科に行くべき？歯科に相談すべき？」「持病があっても治療して大丈夫？」と迷う場面が多くあります。これらは専門が異なるからこそ生まれる「すきま」です。このすきまを埋めることが、患者の安全と安心につながります。

医師と歯医者の交換日記は、医師・歯科医師・患者すべての立場で「医科と歯科のつながり」を理解し、よりよい選択ができるよう支えるメディアです。

### このメディアが目指すもの
医科と歯科が扱うテーマは異なりますが、「患者の健康を守る」ゴールは同じです。

- 医師向け: 口腔ケアの必要性を理解するきっかけ。糖尿病患者の血糖コントロールと歯周治療、誤嚥性肺炎予防と歯科介入、心疾患・抗凝固薬患者の歯科治療連携など。
- 歯科医師向け: 全身管理を学ぶ入り口。抗凝固薬の判断、高血圧・心不全患者のリスク管理、糖尿病患者の治癒遅延の医学的背景など。
- 患者向け: 医科と歯科のつながりを正しく理解する手がかり。どちらに相談すべきか、持病があるけれど歯科治療は大丈夫か、といった疑問に答える情報。

### 運営
- 一般社団法人 正しい医療知識を広める会: https://tadashiiiryou.or.jp/
- 医療法人社団芯聖会: https://shinsei-kai.jp/

---

## 3. お問い合わせ

URL: ${BASE_URL}/contact

ご意見・ご質問・ご依頼などがございましたら、フォームよりお気軽にご連絡ください。取材、連携企画、情報提供の窓口です。

---

## 4. 資料ダウンロード

URL: ${BASE_URL}/newsletter

医科歯科連携マニュアル＆フォーマットをダウンロードできます。登録後、メールでダウンロード用リンクをお届けします。現場でそのまま使えるチェックリストや連携のポイント、フォーマット例をまとめた資料です。医者と歯医者の交換日記のメルマガにも同時にご登録いただきます。

---

## 5. プライバシーポリシー

URL: ${BASE_URL}/privacy

当サイトは、利用者の個人情報の重要性を認識し、個人情報保護法および関連法令を遵守し、適切な取扱いおよび保護に努めます。個人情報は、お問い合わせフォーム、メールマガジン登録、Cookie等により取得することがあります。利用目的は、サービスの提供・運営、お問い合わせへの回答、改善・分析、セキュリティ確保などです。第三者提供は原則行いません。Cookieやアクセス解析についての詳細はページをご確認ください。

---

## 6. 利用規約

URL: ${BASE_URL}/terms

本利用規約は、医者と歯医者の交換日記が提供するサービスの利用条件を定めるものです。利用登録、禁止事項、免責事項等について、詳細はページをご確認ください。

---

## 7. 一般向け記事（全文）${generalRes.contents.length}件

`)

  generalRes.contents.forEach((a) => {
    parts.push(articleBlock(a, 'general'))
  })

  parts.push(`
---

## 8. 医療従事者向け記事（全文）${medicalRes.contents.length}件

`)

  medicalRes.contents.forEach((a) => {
    parts.push(articleBlock(a, 'medical-articles'))
  })

  parts.push(`
---

※ このドキュメントは自動生成されています。最新の内容は各ページをご確認ください。
`)

  const content = parts.join('')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
