export type PortalItem = {
  id: string
  title: string
  summary: string
  image: string | null
  url: string
  category: string
  badge: string | null
  tags?: string[]
  published_at?: string | null
  service: string
  service_label: string
  slot: string
  scores?: Record<string, number | null>
  rank?: number
  image_square?: string | null // 작은 정사각 썸네일용(없으면 image를 쓴다)
  price?: number // 네모네스토어 상품: 판매가(할인가가 있으면 할인가)
  list_price?: number | null // 할인 전 정가(할인 없으면 null)
  discount_pct?: number
}

export type DiscoverPanel = {
  key: string
  category: string
  title: string
  sub: string
  link: string
  ranked: boolean
  items: PortalItem[]
}

export type PortalToday = {
  date: string
  generated_at: string | null
  discover: DiscoverPanel[]
  channels?: DiscoverPanel[]
  lii: PortalItem[]
  observe: { all: PortalItem[]; place: PortalItem[]; taste: PortalItem[]; plant: PortalItem[]; mind: PortalItem[]; future: PortalItem[] }
  aim_latest: PortalItem[]
  store?: PortalItem[] // 네모네스토어(네이버 스마트스토어) 최신 상품
  service_images: Record<string, string | null>
  news: { id: number; title: string; url: string; date: string }[]
  status: Record<string, string | boolean>
}

export const EMPTY_TODAY: PortalToday = {
  date: '', generated_at: null, discover: [], lii: [],
  observe: { all: [], place: [], taste: [], plant: [], mind: [], future: [] },
  aim_latest: [], store: [], service_images: {}, news: [], status: {},
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : ''
}
