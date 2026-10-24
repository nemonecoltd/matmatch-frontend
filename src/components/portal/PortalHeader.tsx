'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

const NAV = [
  { label: '오늘의 네모네', href: '#today' },
  { label: '서비스', href: '#services' },
  { label: '회사소개', href: 'https://home.nemoneai.com' },
]

// 히어로 위에 투명하게 겹치고, 스크롤하면 흰 배경 + 하단 라인으로 전환된다.
export default function PortalHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const solid = scrolled
  const link = `text-[13px] font-medium no-underline whitespace-nowrap ${solid ? 'text-[#1A2430]' : 'text-white/95'} hover:opacity-70 md:text-sm`
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${solid ? 'bg-white/95 backdrop-blur border-b border-[#E3E8EE]' : 'bg-gradient-to-b from-black/55 to-transparent'}`}>
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:h-16 md:px-10">
        <a href="/" className={`not-italic text-[20px] font-medium tracking-[0.28em] no-underline md:text-[22px] ${solid ? 'text-[#35577A]' : 'text-white'}`}>NEMONE</a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="주요 메뉴">
          {NAV.map((n) => <a key={n.label} href={n.href} className={link}>{n.label}</a>)}
        </nav>
        <a href="/search" aria-label="검색" className={`flex h-10 w-10 items-center justify-center rounded-full ${solid ? 'text-[#1A2430]' : 'text-white'}`}><Search size={19} /></a>
      </div>
      {/* 모바일: 메뉴를 숨기지 않고 로고 아래 한 줄로 항상 노출 */}
      <nav className="mx-auto flex max-w-[1200px] items-center gap-5 overflow-x-auto px-4 pb-2.5 md:hidden" aria-label="주요 메뉴(모바일)">
        {[...NAV, { label: '네모네 AIM', href: '/aim' }].map((n) => <a key={n.label} href={n.href} className={link}>{n.label}</a>)}
      </nav>
    </header>
  )
}
