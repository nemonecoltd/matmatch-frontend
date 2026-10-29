'use client'

import OutLink from './OutLink'

export function SantaWidget({ quote, sub }: { quote: string; sub: string }) {
  return (
    <section aria-label="오늘의 칭찬 한마디" className="relative overflow-hidden rounded-2xl border border-[#E3E8EE] bg-gradient-to-br from-[#E6F1FA] via-[#F1F7FC] to-white p-5">
      <p className="text-[13px] font-semibold text-[#1A2430]">오늘의 칭찬 한마디</p>
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
