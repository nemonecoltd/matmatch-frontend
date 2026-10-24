import OutLink from './OutLink'
import { fmtDate, type PortalItem, type PortalToday } from './types'
import { PORTAL_LAB, PORTAL_SERVICES, PORTAL_SNS, SANTA_QUOTES } from '@/lib/portalContent'
import { SantaWidget, FortuneWidget } from './Widgets'
import ObservationTabs from './ObservationTabs'

function SectionHeader({ title, desc, href, link, id }: { title: string; desc: string; href?: string; link?: string; id?: string }) {
  return (
    <div id={id} className="mb-5 flex items-start justify-between gap-4 scroll-mt-20">
      <div className="flex items-start gap-3">
        <span aria-hidden className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#35577A]"><span className="block h-2.5 w-2.5 rounded-[3px] border-2 border-white" /></span>
        <div>
          <h2 className="not-italic text-[20px] font-bold leading-tight text-[#1A2430]">{title}</h2>
          <p className="mt-1 text-[13px] text-[#6B7785]">{desc}</p>
        </div>
      </div>
      {href && link && <a href={href} className="mt-1 whitespace-nowrap text-[12px] text-[#6B7785] no-underline hover:text-[#35577A]">{link} →</a>}
    </div>
  )
}

function Arrow() {
  return <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#C9D3E0] text-[13px] text-[#35577A] transition-colors group-hover:bg-[#35577A] group-hover:text-white">→</span>
}

function DiscoverCard({ it }: { it: PortalItem }) {
  return (
    <OutLink href={it.url} service={it.service} slot={it.slot} className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3E8EE] bg-white no-underline shadow-[0_2px_12px_rgba(20,40,60,.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(20,40,60,.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F8FB]">
        {it.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1A2430]">{it.category}</span>
        {it.badge && <span className="absolute right-3 top-3 rounded-full bg-[#35577A] px-2.5 py-1 text-[10px] font-semibold text-white">{it.badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="not-italic text-[15px] font-semibold leading-snug text-[#1A2430] line-clamp-2">{it.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B7785] line-clamp-2">{it.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {(it.tags || []).filter((t) => t.length <= 9).slice(0, 2).map((t) => <span key={t} className="rounded-md bg-[#EEF2F6] px-2 py-0.5 text-[11px] text-[#6B7785]">#{t}</span>)}
          </div>
          <Arrow />
        </div>
      </div>
    </OutLink>
  )
}

export function Hero({ date }: { date: string }) {
  const d = date ? date.replace(/-/g, '.') : ''
  return (
    <section className="relative isolate min-h-[320px] overflow-hidden bg-[#16212e] md:h-[360px]" aria-label="오늘의 네모네">
      {/* 회사 홈(home.nemoneai.com)의 대표(OG) 이미지 — 데스크톱은 오른쪽에 원본 비율로 놓고 왼쪽은 남색으로 녹인다 */}
      <div className="absolute inset-0 -z-10 bg-cover bg-[position:70%_center] md:inset-y-0 md:left-auto md:right-0 md:aspect-[1024/500] md:h-full md:w-auto" style={{ backgroundImage: "url('/portal/og-home.jpg')" }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#16212e]/80 to-[#16212e]/92 md:bg-gradient-to-r md:from-[#16212e] md:via-[#16212e] md:via-[44%] md:to-[#16212e]/0 md:to-[66%]" />
      <div className="mx-auto flex h-full min-h-[320px] max-w-[1200px] flex-col justify-end px-4 pb-8 pt-32 md:min-h-0 md:px-10 md:pt-20">
        <p className="text-[11px] uppercase tracking-[0.12em] text-white/80">The world, observed by Nemone</p>
        <h1 className="not-italic mt-3 text-[30px] font-semibold leading-[1.25] text-white md:text-[40px]">오늘, 세상은<br />어떻게 달라지고 있을까?</h1>
        <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-white/85 md:text-[15px]">도시의 새로운 취향부터 한 접시의 변화,<br className="hidden md:block" /> 자라는 식물과 마음, 기업의 긴 흐름까지.</p>
        <p className="mt-5 text-[11px] uppercase tracking-[0.12em] text-white/70">Nemone Observatory · {d}</p>
      </div>
    </section>
  )
}

export function DiscoverSection({ today }: { today: PortalToday }) {
  const seed = Math.floor((Date.now() + 9 * 3600 * 1000) / 86400000)
  const q = SANTA_QUOTES[seed % SANTA_QUOTES.length]
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-10 md:px-10">
      <SectionHeader id="today" title="오늘의 발견" desc="네모네가 엄선한 지금 가장 흥미로운 세 가지" />
      <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
        {today.discover.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">{today.discover.map((it) => <DiscoverCard key={`${it.service}-${it.id}`} it={it} />)}</div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#D5DCE5] p-8 text-center text-[14px] text-[#6B7785]">오늘의 발견을 준비하고 있어요.</p>
        )}
        <div className="flex flex-col gap-5">
          <SantaWidget quote={q.quote} sub={q.sub} />
          <FortuneWidget />
        </div>
      </div>
    </section>
  )
}

const SCORE_LABEL: Record<string, string> = { growth: '성장성', profitability: '수익성', valuation: '밸류에이션', financial_health: '재무건전성' }

export function LiiSection({ items }: { items: PortalItem[] }) {
  if (items.length === 0) return null // 분석을 못 가져오면 섹션 전체를 숨긴다(레이아웃 유지)
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-[72px] md:px-10">
      <SectionHeader title="오늘의 분석" desc="LII가 5년 치 재무 데이터로 정리한 오늘의 기업 분석 2건" href="https://msm.nemoneai.com" link="LII 더 보기" />
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((it) => (
          <OutLink key={it.id} href={it.url} service={it.service} slot={it.slot} className="group block rounded-2xl border border-[#E3E8EE] bg-white p-5 no-underline shadow-[0_2px_12px_rgba(20,40,60,.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(20,40,60,.12)]">
            <div className="flex items-center justify-between">
              <h3 className="not-italic text-[18px] font-bold text-[#1A2430]">{it.title}</h3>
              <span className="rounded-full bg-[#EEF2F6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#35577A]">LII VIEW</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {Object.entries(SCORE_LABEL).map(([k, label]) => {
                const v = it.scores?.[k]
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between text-[12px]"><span className="text-[#6B7785]">{label}</span><span className="font-semibold text-[#1A2430]">{v ?? '-'}</span></div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EEF2F6]"><div className="h-full rounded-full bg-[#35577A]" style={{ width: `${Math.max(0, Math.min(100, Number(v) || 0))}%` }} /></div>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-[#4A5666] line-clamp-3">{it.summary}</p>
            <p className="mt-3 text-[12px] font-medium text-[#35577A]">분석 전체 보기 <span aria-hidden>→</span></p>
          </OutLink>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[#8A95A3]">AI가 공개된 재무 데이터를 정리한 참고 정보이며 투자 권유나 종목 추천이 아닙니다.</p>
    </section>
  )
}

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-[72px] md:px-10">
      <SectionHeader id="services" title="네모네의 5가지 서비스" desc="각기 다른 관점이 모여, 더 넓은 세상을 봅니다" href="https://home.nemoneai.com" link="회사 소개" />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {PORTAL_SERVICES.map((s) => (
          <OutLink key={s.key} href={s.url} service={s.key} slot="service_card" className="group flex overflow-hidden rounded-2xl border border-[#E3E8EE] bg-white no-underline shadow-[0_2px_12px_rgba(20,40,60,.06)] md:flex-col">
            {/* 썸네일은 각 서비스의 OG(대표) 이미지 — 모바일은 왼쪽 작은 이미지, 데스크톱은 위쪽 원본 비율 */}
            <div className="w-[124px] flex-shrink-0 overflow-hidden bg-[#F5F8FB] sm:w-[160px] md:aspect-[1024/500] md:w-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={`${s.name} 대표 이미지`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-3.5 md:p-4">
              <p className="text-[11px] font-semibold text-[#35577A]">{s.no} · {s.name}</p>
              <h3 className="not-italic mt-1 text-[14px] font-bold leading-snug text-[#1A2430] md:mt-1.5 md:text-[15px]">{s.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7785] line-clamp-2 md:mt-2 md:line-clamp-3">{s.desc}</p>
              <div className="mt-auto hidden pt-3 md:block"><Arrow /></div>
            </div>
          </OutLink>
        ))}
      </div>
      {/* 와랑스튜디오 LAB — 서비스 5칸과 별개로 아래에 가로 띠 */}
      <OutLink href={PORTAL_LAB.url} service="lab" slot="service_lab" className="group relative mt-5 flex min-h-[132px] items-center overflow-hidden rounded-2xl no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PORTAL_LAB.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[center_72%] transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16212e]/90 via-[#16212e]/60 to-[#16212e]/10" />
        <div className="relative flex w-full flex-col gap-3 p-5 text-white md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">LAB</p>
            <h3 className="not-italic mt-1 text-[18px] font-bold leading-snug">{PORTAL_LAB.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-white/90">{PORTAL_LAB.lines.join(' · ')}</p>
          </div>
          <span className="inline-block self-start whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#1A2430] md:self-auto">{PORTAL_LAB.button} →</span>
        </div>
      </OutLink>
    </section>
  )
}

export function ObserveSection({ today }: { today: PortalToday }) {
  const hasAny = today.observe.all.length > 0
  return (
    <section className="mx-auto max-w-[1200px] border-t border-[#E3E8EE] px-4 pt-14 md:px-10 mt-[72px]">
      <SectionHeader title="오늘의 관찰" desc="서비스를 가로지르는 오늘의 이야기" />
      <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
        {hasAny ? <ObservationTabs observe={today.observe} /> : <p className="rounded-2xl border border-dashed border-[#D5DCE5] p-8 text-center text-[14px] text-[#6B7785]">오늘의 관찰을 준비하고 있어요.</p>}
        <aside className="space-y-8 lg:border-l lg:border-[#E3E8EE] lg:pl-6">
          <div>
            <div className="mb-2 flex items-center justify-between"><h3 className="not-italic text-[15px] font-bold text-[#1A2430]">주요 소식</h3><a href="https://home.nemoneai.com/notice/" className="text-[12px] text-[#6B7785] no-underline">전체보기 →</a></div>
            {today.news.length === 0 ? <p className="py-4 text-[13px] text-[#6B7785]">새 소식이 없어요.</p> : today.news.map((n) => (
              <OutLink key={n.id} href={n.url} service="home" slot="news" className="block border-b border-[#E3E8EE] py-3 no-underline last:border-b-0">
                <p className="text-[13px] font-medium leading-snug text-[#1A2430] line-clamp-2">{n.title}</p>
                <p className="mt-1 text-[11px] text-[#8A95A3]">{n.date}</p>
              </OutLink>
            ))}
          </div>
          {today.aim_latest.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between"><h3 className="not-italic text-[15px] font-bold text-[#1A2430]">네모네 AIM 최신 글</h3><a href="/aim" className="text-[12px] text-[#6B7785] no-underline">AIM 홈 →</a></div>
              {today.aim_latest.map((it) => (
                <OutLink key={it.id} href={it.url} service="aim" slot={it.slot} className="block border-b border-[#E3E8EE] py-3 no-underline last:border-b-0">
                  <p className="text-[13px] font-medium leading-snug text-[#1A2430] line-clamp-2">{it.title}</p>
                  <p className="mt-1 text-[11px] text-[#8A95A3]">{fmtDate(it.published_at)}</p>
                </OutLink>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export function StoryBand() {
  return (
    <section className="mx-auto mt-[72px] max-w-[1200px] px-4 md:px-10">
      <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#DCEBF7] via-[#EAF3FA] to-[#F4F9FD] p-6 md:flex-row md:items-center md:px-10 md:py-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#35577A]">Nemone · Our Story</p>
          <p className="mt-2 text-[20px] font-semibold leading-snug text-[#1A2430]">세상을 관찰하고,<br className="md:hidden" /> 변화를 당신의 것으로.</p>
        </div>
        <p className="max-w-[360px] text-[13px] leading-relaxed text-[#4A5666]">사람의 취향, 도시의 공간, 먹고 사는 일과 기술의 흐름. 네모네는 그 안에서 놓치기 쉬운 변화의 신호를 찾아 전합니다.</p>
        <a href="https://home.nemoneai.com" className="whitespace-nowrap rounded-full border border-[#35577A] px-5 py-2 text-[13px] font-medium text-[#35577A] no-underline hover:bg-[#35577A] hover:text-white">더 알아보기 →</a>
      </div>
    </section>
  )
}

export function PortalFooter() {
  return (
    <footer className="mx-auto mt-14 max-w-[1200px] px-4 md:px-10">
      <div className="flex flex-col border-t border-[#E3E8EE] py-8 items-start justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="not-italic text-[18px] font-medium tracking-[0.28em] text-[#35577A]">NEMONE</p>
          <p className="mt-1 text-[11px] text-[#8A95A3]">세상을 관찰하고, 변화를 당신의 것으로. © NEMONE INC.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]" aria-label="푸터 메뉴">
          <a href="#services" className="text-[#4A5666] no-underline hover:text-[#35577A]">서비스</a>
          <a href="https://home.nemoneai.com" className="text-[#4A5666] no-underline hover:text-[#35577A]">회사소개</a>
          <a href="https://auth.nemoneai.com/terms" className="text-[#4A5666] no-underline hover:text-[#35577A]">이용약관</a>
          <a href="https://auth.nemoneai.com/privacy" className="text-[#4A5666] no-underline hover:text-[#35577A]">개인정보처리방침</a>
          <a href="mailto:contact@nemoneai.com" className="text-[#4A5666] no-underline hover:text-[#35577A]">고객센터</a>
        </nav>
        <div className="flex flex-wrap items-center gap-4">
          {PORTAL_SNS.map((s) => <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#6B7785] no-underline hover:text-[#35577A]">{s.name}</a>)}
        </div>
      </div>
    </footer>
  )
}
