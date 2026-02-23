// app/llm.txt/route.ts
import { client } from '@/lib/microCMS/microcms'

export async function GET() {
  const [generalArticles, medicalArticles, categories, tags] =
    await Promise.all([
      client.getList({ endpoint: 'general', queries: { limit: 100 } }),
      client.getList({ endpoint: 'medical-articles', queries: { limit: 100 } }),
      client.getList({ endpoint: 'categories' }),
      client.getList({ endpoint: 'tags' }),
    ])

  const content = `# 医者と歯医者の交換日記

> 医療従事者向けの情報共有プラットフォーム

## カテゴリ
${categories.contents.map((c) => `- [${c.name}](/categories/${c.slug}): ${c.description || ''}`).join('\n')}

## タグ
${tags.contents.map((t) => `- [${t.name}](/tags/${t.slug})`).join('\n')}

## 記事一覧
${generalArticles.contents.map((a) => `- [${a.title}](/general/${a.id}): ${a.excerpt || ''}`).join('\n')}
${medicalArticles.contents.map((a) => `- [${a.title}](/medical-articles/${a.id}): ${a.excerpt || ''}`).join('\n')}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
