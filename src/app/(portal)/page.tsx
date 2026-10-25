import type { Metadata } from 'next'
import { EMPTY_TODAY, type PortalToday } from '@/components/portal/types'
import { Hero, DiscoverSection, ChannelsSection, LiiSection, ServicesSection, ObserveSection, StoryBand, PortalFooter } from '@/components/portal/Sections'
import AdSlot from '@/components/AdSlot'

export const revalidate = 600 // 10분마다 재생성 — 서비스 피드는 백엔드가 30분 주기로 수집해 둔 스냅샷

const TITLE = '네모네 | 오늘, 세상은 어떻게 달라지고 있을까'
const DESC = '핫플레이스, 미식, 식물, 마음, 기업 분석까지. 네모네의 다섯 서비스가 관찰한 오늘의 변화를 한곳에서 만나보세요.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: 'https://nemoneai.com' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE, description: DESC, url: 'https://nemoneai.com', siteName: '네모네', locale: 'ko_KR', type: 'website',
    images: [{ url: 'https://nemoneai.com/portal/og-home.jpg', width: 1024, height: 500, alt: '네모네' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['https://nemoneai.com/portal/og-home.jpg'] },
}

async function getToday(): Promise<PortalToday> {
  try {
    // 서비스 한 곳이 다운돼도 백엔드가 마지막 성공 스냅샷을 주고, 이 호출 자체가 실패하면 빈 화면(섹션별 빈 상태)으로 그린다
    const res = await fetch('http://127.0.0.1:8080/portal/today', { next: { revalidate: 600 } })
    if (!res.ok) return EMPTY_TODAY
    return { ...EMPTY_TODAY, ...(await res.json()) }
  } catch {
    return EMPTY_TODAY
  }
}

export default async function PortalPage() {
  const today = await getToday()
  const date = today.date || new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10)
  return (
    <>
      <Hero date={date} />
      <main>
        <DiscoverSection today={today} />
        {/* 광고 배너 — 오늘의 발견 바로 아래 (AdSense 슬롯 portal_main) */}
        <div className="mx-auto mt-10 max-w-[1200px] px-4 md:px-10" aria-label="광고">
          <AdSlot adSlot="3545007575" />
        </div>
        <ServicesSection />
        <ObserveSection today={today} />
        <ChannelsSection panels={today.channels ?? []} />
        <div className="mx-auto mt-10 max-w-[1200px] px-4 md:px-10">
          <AdSlot adSlot="3371700491" />
        </div>
        <LiiSection items={today.lii} />
        <StoryBand />
      </main>
      <PortalFooter />
    </>
  )
}
