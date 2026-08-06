// 네이버 서치어드바이저 RSS 제출용 피드.
// 네이버는 콘텐츠 사이트 신규 글 자동 발견에 sitemap보다 RSS를 우선 폴링하므로,
// 기사를 발행할 때마다 수동 색인요청하던 것을 이 피드로 대체하기 위해 신설.
import { NextResponse } from 'next/server'

export const revalidate = 1800 // 30분마다 재생성 — 발행 후 네이버가 빠르게 발견하도록

const BASE = 'https://nemoneai.com'
const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8080'

function esc(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// body_text에서 태그/엔티티를 걷어내고 요약 길이로 자름
function summarize(raw: string, len = 200): string {
  const decoded = (raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return decoded.length > len ? decoded.slice(0, len) + '…' : decoded
}

const CATEGORY_KO: Record<string, string> = {
  Taste: '미식', Culture: '문화', Life: '라이프', Tech: '테크',
}

export async function GET() {
  let posts: any[] = []
  try {
    const res = await fetch(`${BACKEND}/posts?limit=50`, { next: { revalidate } })
    if (res.ok) {
      const data = await res.json()
      posts = Array.isArray(data) ? data : (data.posts || [])
    }
  } catch (e) {
    console.error('RSS fetch error:', e)
  }

  // 최신순 정렬 후 상위 50개
  posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  posts = posts.slice(0, 50)

  const lastBuild = posts[0]?.created_at ? new Date(posts[0].created_at).toUTCString() : new Date().toUTCString()

  const items = posts.map((p) => {
    const url = `${BASE}/posts/${p.id}`
    const pubDate = new Date(p.created_at || Date.now()).toUTCString()
    const cat = CATEGORY_KO[p.category] || p.category || ''
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${cat ? `<category>${esc(cat)}</category>` : ''}
      <description>${esc(summarize(p.body_text))}</description>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>네모네AIM</title>
    <link>${BASE}</link>
    <description>미식·문화·라이프·테크 — 당신 시간의 알찬 소비</description>
    <language>ko</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  })
}
