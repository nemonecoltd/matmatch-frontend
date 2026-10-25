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
  service_images: Record<string, string | null>
  news: { id: number; title: string; url: string; date: string }[]
  status: Record<string, string | boolean>
}

export const EMPTY_TODAY: PortalToday = {
  date: '', generated_at: null, discover: [], lii: [],
  observe: { all: [], place: [], taste: [], plant: [], mind: [], future: [] },
  aim_latest: [], service_images: {}, news: [], status: {},
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : ''
}
