'use client'

import { useState } from 'react'
import OutLink from './OutLink'
import { fmtDate, type PortalItem, type PortalToday } from './types'

const TABS: { key: keyof PortalToday['observe']; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'place', label: '핫플레이스' },
  { key: 'taste', label: '미식' },
  { key: 'plant', label: '식물' },
  { key: 'mind', label: '마음' },
  { key: 'future', label: '미래' },
]

function Featured({ it }: { it: PortalItem }) {
  return (
    <OutLink href={it.url} service={it.service} slot={it.slot} className="group block overflow-hidden rounded-2xl border border-[#E3E8EE] bg-white no-underline shadow-[0_2px_12px_rgba(20,40,60,.06)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F8FB]">
        {it.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1A2430]">{it.category}</span>
      </div>
      <div className="p-5">
        <h3 className="not-italic text-[18px] font-semibold leading-snug text-[#1A2430] line-clamp-2">{it.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[#6B7785] line-clamp-2">{it.summary}</p>
        <p className="mt-3 text-[12px] text-[#6B7785]">{[fmtDate(it.published_at), it.service_label].filter(Boolean).join(' · ')}</p>
      </div>
    </OutLink>
  )
}

function Row({ it }: { it: PortalItem }) {
  return (
    <OutLink href={it.url} service={it.service} slot={it.slot} className="group flex gap-4 border-b border-[#E3E8EE] py-4 no-underline last:border-b-0">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[10px] bg-[#F5F8FB]">
        {it.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#35577A]">{it.category}</p>
        <h4 className="not-italic mt-1 text-[15px] font-semibold leading-snug text-[#1A2430] line-clamp-2">{it.title}</h4>
        <p className="mt-1.5 text-[12px] text-[#6B7785]">{[fmtDate(it.published_at), it.service_label].filter(Boolean).join(' · ')}</p>
      </div>
    </OutLink>
  )
}

// 모든 탭의 내용을 HTML에 담고 선택되지 않은 탭만 숨긴다(크롤러가 링크를 볼 수 있게).
export default function ObservationTabs({ observe }: { observe: PortalToday['observe'] }) {
  const tabs = TABS.filter((t) => observe[t.key].length > 0) // 비어 있는 탭(예: 마음)은 숨김
  const [active, setActive] = useState<keyof PortalToday['observe']>('all')
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="오늘의 관찰 분류">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={active === t.key} onClick={() => setActive(t.key)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${active === t.key ? 'border-[#35577A] bg-[#35577A] text-white' : 'border-[#D5DCE5] bg-white text-[#4A5666] hover:border-[#35577A]'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => {
        const [first, ...rest] = observe[t.key]
        return (
          <div key={t.key} role="tabpanel" hidden={active !== t.key} className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
            <Featured it={first} />
            <div>{rest.slice(0, 4).map((it) => <Row key={`${it.service}-${it.id}`} it={it} />)}</div>
          </div>
        )
      })}
    </div>
  )
}
