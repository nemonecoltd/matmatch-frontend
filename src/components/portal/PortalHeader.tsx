'use client'

import { useEffect, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'

const NAV = [
  { label: '오늘의 네모네', href: '#today' },
  { label: '서비스', href: '#services' },
  { label: '회사소개', href: 'https://home.nemoneai.com' },
]

// 히어로 위에 투명하게 겹치고, 스크롤하면 흰 배경 + 하단 라인으로 전환된다.
export default function PortalHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const solid = scrolled || open
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${solid ? 'bg-white/95 backdrop-blur border-b border-[#E3E8EE]' : 'bg-gradient-to-b from-black/45 to-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-10">
        <a href="/" className={`not-italic text-[22px] font-medium tracking-[0.28em] no-underline ${solid ? 'text-[#35577A]' : 'text-white'}`}>NEMONE</a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="주요 메뉴">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={`text-sm font-medium no-underline ${solid ? 'text-[#1A2430]' : 'text-white/95'} hover:opacity-70`}>{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <a href="/search" aria-label="검색" className={`flex h-10 w-10 items-center justify-center rounded-full ${solid ? 'text-[#1A2430]' : 'text-white'}`}><Search size={19} /></a>
          <button aria-label={open ? '메뉴 닫기' : '메뉴 열기'} onClick={() => setOpen(!open)} className={`flex h-10 w-10 items-center justify-center rounded-full md:hidden ${solid ? 'text-[#1A2430]' : 'text-white'}`}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-[#E3E8EE] bg-white px-4 pb-4 md:hidden" aria-label="모바일 메뉴">
          {[...NAV, { label: '네모네 AIM', href: '/aim' }].map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="block border-b border-[#EEF2F6] py-3 text-[15px] text-[#1A2430] no-underline">{n.label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}
