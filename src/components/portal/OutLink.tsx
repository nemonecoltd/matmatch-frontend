'use client'

import type { ReactNode } from 'react'

// 포털 → 서비스 이동 링크. 클릭하면 어느 서비스·어느 자리인지 기록(beacon)한다. 개인정보 없음.
export default function OutLink({
  href, service, slot, className, children, ariaLabel,
}: { href: string; service: string; slot: string; className?: string; children: ReactNode; ariaLabel?: string }) {
  const external = href.startsWith('http')
  // 크롤러가 읽는 href에는 추적용 utm을 빼고 깨끗한 주소만 둔다 — utm 변형 주소를 구글이 따로 발견해
  // "사용자가 선택한 표준이 없는 중복 페이지"로 쌓이던 문제(PACE, 2026-11-16). utm은 사람이 누르는 순간(클릭·터치·가운데 클릭)에만 붙인다.
  const { clean, tracked } = (() => {
    if (!external) return { clean: href, tracked: href }
    try {
      const u = new URL(href)
      const hasUtm = [...u.searchParams.keys()].some((k) => k.startsWith('utm_'))
      if (!hasUtm) return { clean: href, tracked: href }
      const c = new URL(href)
      for (const k of [...c.searchParams.keys()]) if (k.startsWith('utm_')) c.searchParams.delete(k)
      return { clean: c.toString(), tracked: href }
    } catch {
      return { clean: href, tracked: href }
    }
  })()
  const withUtm = (e: { currentTarget: HTMLAnchorElement }) => { if (e.currentTarget.href !== tracked) e.currentTarget.href = tracked }
  const onClick = (e: { currentTarget: HTMLAnchorElement }) => {
    withUtm(e)
    try {
      const body = JSON.stringify({ service, slot })
      if (navigator.sendBeacon) navigator.sendBeacon('/api/portal/click', new Blob([body], { type: 'application/json' }))
      else fetch('/api/portal/click', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
    } catch {
      // 기록 실패는 이동을 막지 않는다
    }
  }
  return (
    <a
      href={clean}
      onClick={onClick}
      onMouseDown={withUtm}
      onTouchStart={withUtm}
      onKeyDown={withUtm}
      className={className}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
