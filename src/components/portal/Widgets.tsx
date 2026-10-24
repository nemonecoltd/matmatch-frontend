'use client'

import { useEffect, useState } from 'react'
import { FORTUNE_SAMPLES, ZODIACS } from '@/lib/portalContent'
import OutLink from './OutLink'

function dayNumber(): number {
  // KST 기준 날짜 번호 — 같은 날엔 같은 문장, 날이 바뀌면 다음 문장
  return Math.floor((Date.now() + 9 * 3600 * 1000) / 86400000)
}

export function SantaWidget({ quote, sub }: { quote: string; sub: string }) {
  return (
    <section aria-label="오늘의 한마디" className="relative overflow-hidden rounded-2xl border border-[#E3E8EE] bg-gradient-to-br from-[#E6F1FA] via-[#F1F7FC] to-white p-5">
      <p className="text-[13px] font-semibold text-[#1A2430]">오늘의 한마디</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/portal/santa-card.jpg" alt="" aria-hidden width={72} height={100} className="absolute right-4 top-4 h-[100px] w-[72px] rotate-3 rounded-lg object-cover object-top shadow-md" />
      <blockquote className="mt-4 max-w-[72%] text-[16px] font-medium leading-[1.6] text-[#1A2430]">&ldquo;{quote}&rdquo;</blockquote>
      <p className="mt-2 text-[12px] text-[#6B7785]">{sub}</p>
      <OutLink href="https://santa.nemoneai.com" service="santa" slot="widget_santa" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#35577A] px-4 py-1.5 text-[12px] font-medium text-[#35577A] no-underline hover:bg-[#35577A] hover:text-white">
        오늘의 칭찬 보기 →
      </OutLink>
    </section>
  )
}

// 띠 선택은 이 브라우저에만 저장한다(localStorage, 실패해도 동작). 생년월일 등 개인정보는 받지 않는다.
export function FortuneWidget() {
  const [zodiac, setZodiac] = useState<number>(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nemone_portal_zodiac')
      if (saved !== null && Number(saved) >= 0 && Number(saved) < 12) setZodiac(Number(saved))
      if (localStorage.getItem('nemone_portal_zodiac_shown') === String(dayNumber())) setShown(true)
    } catch {
      // 저장소를 못 쓰는 환경 — 기본값으로 동작
    }
  }, [])

  const pick = (i: number) => {
    setZodiac(i)
    try { localStorage.setItem('nemone_portal_zodiac', String(i)) } catch { /* 무시 */ }
  }
  const reveal = () => {
    setShown(true)
    try { localStorage.setItem('nemone_portal_zodiac_shown', String(dayNumber())) } catch { /* 무시 */ }
  }
  const text = FORTUNE_SAMPLES[(dayNumber() + zodiac) % FORTUNE_SAMPLES.length]

  return (
    <section aria-label="오늘의 무료 운세" className="relative overflow-hidden rounded-2xl border border-[#E3E8EE] bg-gradient-to-br from-[#EFE9FB] via-[#EAF1FB] to-[#F6FAFD] p-5">
      <p className="text-[13px] font-semibold text-[#1A2430]">오늘의 무료 운세</p>
      <p className="mt-1 text-[12px] text-[#6B7785]">재미로 보는 오늘의 운세 · 띠를 골라 보세요</p>
      <div className="mt-3 flex items-center gap-2">
        <select aria-label="띠 선택" value={zodiac} onChange={(e) => pick(Number(e.target.value))}
          className="rounded-full border border-[#C9D3E0] bg-white px-3 py-1.5 text-[13px] text-[#1A2430]">
          {ZODIACS.map((z, i) => <option key={z} value={i}>{z}띠</option>)}
        </select>
        <button onClick={reveal} className="rounded-full border border-[#35577A] px-4 py-1.5 text-[12px] font-medium text-[#35577A] hover:bg-[#35577A] hover:text-white">
          운세 보기 →
        </button>
      </div>
      {shown && (
        <p className="mt-4 rounded-xl bg-white/70 p-3 text-[13px] leading-relaxed text-[#1A2430]">
          <span className="mb-1 block text-[11px] font-semibold text-[#35577A]">{ZODIACS[zodiac]}띠 · 오늘</span>
          {text}
        </p>
      )}
      <p className="mt-3 text-[11px] text-[#8A95A3]">샘플 문구이며 의학·금융 등 어떤 판단의 근거도 아닙니다.</p>
    </section>
  )
}
