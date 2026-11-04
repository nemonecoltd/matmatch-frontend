// 기사 하단 "함께 읽으면 좋은 글" — 검색엔진이 글끼리의 주제 관계를 따라갈 수 있게 같은 Special·같은 태그의 글을 본문 링크로 잇는다(2026-11-04).
// 새 API 없이 이미 쓰는 목록(/posts?limit=10000, 사이트맵과 같은 URL이라 캐시를 공유)과 /specials만 쓴다. 실패하면 조용히 빈 결과.
import { getServicePostMap } from '@/lib/serviceHome'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8080'

export type LinkItem = { id: number; title: string }
export type InternalLinks = { special: { id: number; title: string } | null; sameSpecial: LinkItem[]; sameTags: LinkItem[] }

const tagsOf = (s?: string | null) => (s || '').split(',').map((t) => t.trim()).filter(Boolean)

export async function getInternalLinks(post: { id: number; tags?: string | null }, excludeIds: number[]): Promise<InternalLinks> {
  const empty: InternalLinks = { special: null, sameSpecial: [], sameTags: [] }
  try {
    const [pr, sr, owned] = await Promise.all([
      fetch(`${BACKEND}/posts?limit=10000`, { next: { revalidate: 3600 } }),
      fetch(`${BACKEND}/specials`, { next: { revalidate: 3600 } }),
      getServicePostMap(),
    ])
    if (!pr.ok) return empty
    const pj = await pr.json()
    const posts: any[] = Array.isArray(pj) ? pj : pj.posts || []
    const specials: any[] = sr.ok ? await sr.json() : []
    const skip = new Set<number>([post.id, ...excludeIds, ...owned.keys()])   // 정본이 다른 서비스인 글은 맛매치에서 링크하지 않는다
    const byId = new Map<number, any>(posts.map((p) => [Number(p.id), p]))

    // 같은 Special(연재·묶음) — 이 글이 들어 있는 첫 Special과 그 안의 다른 글
    let special: InternalLinks['special'] = null
    let sameSpecial: LinkItem[] = []
    for (const sp of specials) {
      let ids: number[] = []
      try { ids = (typeof sp.post_ids === 'string' ? JSON.parse(sp.post_ids) : sp.post_ids || []).map(Number) } catch { ids = [] }
      if (!ids.includes(post.id)) continue
      if (Number(sp.id) in { 5: 1, 6: 1 }) continue   // PACE·PLANTS 서비스 Special은 허브로 링크하지 않는다
      special = { id: Number(sp.id), title: String(sp.title) }
      sameSpecial = ids.filter((i) => !skip.has(i) && byId.has(i)).slice(0, 5).map((i) => ({ id: i, title: byId.get(i).title }))
      break
    }

    // 같은 태그 — 겹치는 태그 수가 많은 순(같으면 최신 글 먼저), 너무 흔한 태그(글의 15% 이상)는 점수에서 뺀다
    const mine = tagsOf(post.tags)
    const freq = new Map<string, number>()
    for (const p of posts) for (const t of new Set(tagsOf(p.tags))) freq.set(t, (freq.get(t) || 0) + 1)
    const useful = mine.filter((t) => (freq.get(t) || 0) <= Math.max(3, posts.length * 0.15))
    const taken = new Set(sameSpecial.map((x) => x.id))
    const sameTags = posts
      .filter((p) => !skip.has(Number(p.id)) && !taken.has(Number(p.id)))
      .map((p) => ({ p, score: tagsOf(p.tags).filter((t) => useful.includes(t)).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || Number(b.p.id) - Number(a.p.id))
      .slice(0, 5)
      .map((x) => ({ id: Number(x.p.id), title: String(x.p.title) }))
    return { special, sameSpecial, sameTags }
  } catch {
    return empty
  }
}
