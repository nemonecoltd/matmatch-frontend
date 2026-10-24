import type { Metadata } from 'next'
import PortalHeader from '@/components/portal/PortalHeader'

export const metadata: Metadata = {
  metadataBase: new URL('https://nemoneai.com'),
}

// 포털(/)은 밝은 잡지 톤. 사이트 전역 body 배경(#0c0c0c !important)을 이 페이지에서만 덮는다.
// AIM·기사·카테고리 등 다른 메뉴는 기존 검정 그대로.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#ffffff !important;color:#1A2430 !important}' }} />
      <div className="min-h-screen bg-white text-[#1A2430]">
        <PortalHeader />
        {children}
      </div>
    </>
  )
}
