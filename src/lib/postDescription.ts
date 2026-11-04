// 기사 <meta name="description"> — 본문 앞 150자를 쓰되, 여러 글에 똑같이 들어가는 문장(주간 랭킹 글의 공통 도입부 등)은 건너뛴다(2026-11-04).
// 같은 설명문이 10여 개 글에 반복되면 네이버가 "동일 설명" 경고를 낸다. 공통 문장 판정은 기사 목록(/posts?limit=10000, 사이트맵과 같은 캐시)에서 한다.
const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8080'
const FALLBACK = '네모네AIM, 당신의 시간을 알차게 채워줄 프리미엄 콘텐츠.'

const plain = (html: string) =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const sentencesOf = (text: string): string[] => text.split(/(?<=[.!?。])\s+/).map((s) => s.trim()).filter((s) => s.length >= 8)

let cache: { at: number; counts: Map<string, number> } | null = null

async function sharedSentenceCounts(): Promise<Map<string, number>> {
  if (cache && Date.now() - cache.at < 3600_000) return cache.counts
  const counts = new Map<string, number>()
  try {
    const res = await fetch(`${BACKEND}/posts?limit=10000`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const j = await res.json()
      const posts: any[] = Array.isArray(j) ? j : j.posts || []
      for (const p of posts) for (const s of new Set(sentencesOf(plain(p.body_text)))) counts.set(s, (counts.get(s) || 0) + 1)
    }
  } catch {
    /* 목록을 못 받으면 빈 맵 → 예전처럼 본문 앞부분 그대로 */
  }
  cache = { at: Date.now(), counts }
  return counts
}

export async function postDescription(post: { title?: string; body_text?: string }): Promise<string> {
  const text = plain(post.body_text || '')
  if (!text) return FALLBACK
  const counts = await sharedSentenceCounts()
  const own = sentencesOf(text).filter((s) => (counts.get(s) || 0) < 2)      // 다른 글에도 똑같이 있는 문장은 뺀다
  const picked = own.join(' ').trim() || text                                  // 전부 공통이면(드묾) 예전처럼 본문 앞부분
  return picked.substring(0, 150) || FALLBACK
}
