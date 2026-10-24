// 계열 서비스(PACE·PLANTS)가 "주인"인 기사 판별.
// 이 기사들은 맛매치 Special에 모아 두고(5=PACE, 6=PLANTS) 각 서비스가 같은 글을 매거진으로 보여 준다.
// 2026-10-24부터 **새로 발행하는 글**의 검색 색인·정본(canonical)은 해당 서비스로 모아 트래픽이 서비스로 가게 한다.
// 그 전에 발행한 글은 건드리지 않는다(SERVICE_OWNED_SINCE 이전 = 종전처럼 맛매치가 정본, 색인 이동 리스크 회피).
// PACE·PLANTS 쪽에도 같은 기준일이 있으니 바꿀 땐 세 곳을 함께(환경변수 SERVICE_OWNED_SINCE로도 덮어쓸 수 있음).
// 조회가 실패하면 빈 맵 → 기존처럼 맛매치가 정본(안전한 쪽으로 폴백).
const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8080'

export const SERVICE_OWNED_SINCE = process.env.SERVICE_OWNED_SINCE || '2026-10-24'

export const SERVICE_SPECIALS: Record<number, { name: string; url: (id: number) => string }> = {
  5: { name: 'NEMONE PACE', url: (id) => `https://now.nemoneai.com/magazine/${id}` },
  6: { name: 'NEMONE PLANTS', url: (id) => `https://plants.nemoneai.com/guide/magazine/${id}` },
}

export type ServiceHome = { name: string; url: string }

export async function getServicePostMap(): Promise<Map<number, ServiceHome>> {
  const map = new Map<number, ServiceHome>()
  try {
    // Special 상세에는 글별 발행일(created_at)이 있어 기준일 이후 글만 고를 수 있다
    const results = await Promise.all(
      Object.keys(SERVICE_SPECIALS).map(async (sid) => {
        const res = await fetch(`${BACKEND}/specials/${sid}`, { next: { revalidate: 3600 } })
        return { sid: Number(sid), data: res.ok ? await res.json() : null }
      })
    )
    for (const { sid, data } of results) {
      const svc = SERVICE_SPECIALS[sid]
      for (const post of Array.isArray(data?.posts) ? data.posts : []) {
        const id = Number(post.id)
        const created = String(post.created_at || '').slice(0, 10)
        if (!Number.isFinite(id) || !created || created < SERVICE_OWNED_SINCE) continue
        if (!map.has(id)) map.set(id, { name: svc.name, url: svc.url(id) })
      }
    }
  } catch {
    // 부가 기능 — 실패해도 기사 렌더링·색인에 영향 없게 조용히 무시
  }
  return map
}
