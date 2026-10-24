'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { label: '네모네AIM', href: '/aim' },
  { label: 'NEMONEPACE', href: 'https://now.nemoneai.com' },
  { label: '네모네플랜트', href: 'https://plants.nemoneai.com' },
  { label: 'NEMONE LII', href: 'https://msm.nemoneai.com' },
  { label: '산타칭찬편지', href: 'https://santa.nemoneai.com' },
]

// 히어로 위에 투명하게 겹치고, 스크롤하면 흰 배경 + 하단 라인으로 전환된다.
export default function PortalHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { user, signInWithGoogle, signOut } = useAuth()

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
        <nav className="hidden items-center gap-7 lg:gap-9 md:flex" aria-label="주요 메뉴">
          {NAV.map((n) => <a key={n.label} href={n.href} className={link}>{n.label}</a>)}
        </nav>
        {user ? (
          <button onClick={() => signOut()} className={`${link} rounded-full border px-3.5 py-1.5 ${solid ? 'border-[#C9D3E0]' : 'border-white/70'}`}>로그아웃</button>
        ) : (
          <button onClick={() => signInWithGoogle()} className={`${link} rounded-full border px-3.5 py-1.5 ${solid ? 'border-[#35577A] text-[#35577A]' : 'border-white/70'}`}>로그인</button>
        )}
      </div>
      {/* 모바일: 메뉴를 숨기지 않고 로고 아래 한 줄로 항상 노출 */}
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-2 px-4 pb-2.5 md:hidden" aria-label="주요 메뉴(모바일)">
        {NAV.map((n) => <a key={n.label} href={n.href} className={`${link} !text-[11.5px]`}>{n.label}</a>)}
      </nav>
    </header>
  )
}
