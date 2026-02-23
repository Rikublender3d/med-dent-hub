// app/llm.txt/route.ts
// LLM向けサイト概要（要約版）。全文は /llm-full.txt を参照。
import { client } from '@/lib/microCMS/microcms'
import type {
  ArticleResponse,
  CategoryResponse,
  TagResponse,
} from '@/types/microcms'

const BASE_URL = process.env.BASE_URL ?? 'https://www.ishatohaisha.com'

export async function GET() {
  const [generalRes, medicalRes, categoriesRes, tagsRes] = await Promise.all([
    client.get<ArticleResponse>({
      endpoint: 'general',
      queries: { limit: 100, orders: '-publishedAt' },
    }),
    client.get<ArticleResponse>({
      endpoint: 'medical-articles',
      queries: { limit: 100, orders: '-publishedAt' },
    }),
    client.get<CategoryResponse>({
      endpoint: 'categories',
      queries: { limit: 100 },
    }),
    client.get<TagResponse>({ endpoint: 'tags', queries: { limit: 100 } }),
  ])

  const categories = categoriesRes.contents
  const tags = tagsRes.contents

  const excerpt = (a: (typeof generalRes.contents)[0]) => {
    const src =
      a.description ??
      (a.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    return src.trim().slice(0, 100)
  }

  const content = `# 医者と歯医者の交換日記

> 医療の明日を、現場からよくする。医科歯科連携の判断に迷う場面で役立つ「現場で使える視点」をまとめたメディアです。医師・歯科医師、そして患者さんやそのご家族の判断を支える情報を発信します。詳細版は [LLM向け全文ドキュメント](${BASE_URL}/llm-full.txt) を参照してください。

## サイト概要

医科と歯科のあいだにある「見えないすきま」を埋めるために生まれたメディアです。口腔と全身は密接につながっていますが、この関係性は医療者でも患者でも十分に共有されていないのが現状です。歯周病と血糖コントロールの関係、誤嚥性肺炎予防のための歯科ケア、持病のある患者への歯科治療における医科との連携など、「医科だけ、歯科だけでは完結しない」ケースに対応するための情報を提供しています。

## 主要ページ

- [ホームページ](${BASE_URL}/): おすすめ記事・最新記事の一覧
- [全記事一覧](${BASE_URL}/articles): 一般・医療従事者向け記事を統合表示。カテゴリ・タグでの絞り込みに対応
- [一般向け記事](${BASE_URL}/general): 患者やご家族向けの健康・医療情報
- [医療従事者向け記事](${BASE_URL}/medical-articles): 医師・歯科医師向けの専門記事
- [記事検索](${BASE_URL}/search): キーワードによる記事検索
- [このサイトについて](${BASE_URL}/about): サイトの理念と運営情報
- [お問い合わせ](${BASE_URL}/contact): 取材・連携企画・情報提供の窓口
- [資料ダウンロード](${BASE_URL}/newsletter): 医科歯科連携マニュアルPDF
- [プライバシーポリシー](${BASE_URL}/privacy): 個人情報の取り扱い
- [利用規約](${BASE_URL}/terms): 利用規約

## 対象読者

- [医師向け](${BASE_URL}/medical-articles): 口腔ケアの必要性を理解し、外来・病棟・在宅で役立つ視点を提供。糖尿病患者の歯周治療、誤嚥性肺炎予防、心疾患・抗凝固薬患者の歯科治療連携など
- [歯科医師向け](${BASE_URL}/medical-articles): 全身管理を学ぶ入り口として、抗凝固薬の判断、高血圧・心不全患者のリスク管理、糖尿病患者の治癒遅延の医学的背景などを解説
- [患者・ご家族向け](${BASE_URL}/general): 「医科に行くべき？歯科に相談すべき？」「持病があっても治療して大丈夫？」といった疑問に答える実用的な情報

## カテゴリ

${categories.map((c) => `- [${c.name}](${BASE_URL}/articles?category=${c.id})`).join('\n')}

## タグ

${tags.map((t) => `- [${t.name}](${BASE_URL}/articles?tag=${t.id})`).join('\n')}

## 一般向け記事（${generalRes.contents.length}件）

${generalRes.contents
  .map((a) => {
    const e = excerpt(a)
    return `- [${a.title}](${BASE_URL}/general/${a.id})${e ? `: ${e}` : ''}`
  })
  .join('\n')}

## 医療従事者向け記事（${medicalRes.contents.length}件）

${medicalRes.contents
  .map((a) => {
    const e = excerpt(a)
    return `- [${a.title}](${BASE_URL}/medical-articles/${a.id})${e ? `: ${e}` : ''}`
  })
  .join('\n')}

## 運営

- [一般社団法人 正しい医療知識を広める会](https://tadashiiiryou.or.jp/): 運営法人
- [医療法人社団芯聖会](https://shinsei-kai.jp/): 運営法人

## その他

- [サイトマップ](${BASE_URL}/sitemap.xml)
- [LLM向け全文ドキュメント](${BASE_URL}/llm-full.txt)
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
