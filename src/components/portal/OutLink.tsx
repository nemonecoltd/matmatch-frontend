'use client'

import type { ReactNode } from 'react'

// 포털 → 서비스 이동 링크. 클릭하면 어느 서비스·어느 자리인지 기록(beacon)한다. 개인정보 없음.
export default function OutLink({
  href, service, slot, className, children, ariaLabel,
}: { href: string; service: string; slot: string; className?: string; children: ReactNode; ariaLabel?: string }) {
  const external = href.startsWith('http')
  const onClick = () => {
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
      href={href}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
