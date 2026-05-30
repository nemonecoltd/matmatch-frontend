"use client";

import AdSlot from './AdSlot';
import { usePathname } from 'next/navigation';

export default function SideAds() {
  const pathname = usePathname();

  // 스페셜 관련 페이지에서는 광고 숨김 처리
  if (pathname?.startsWith('/special')) {
    return null;
  }

  return (
    <>
      {/* 왼쪽 사이드 광고: 화면이 넓을 때만 (2xl 이상) 보이고 컨텐츠 바깥에 고정 */}
      <div className="fixed left-4 top-[150px] w-[160px] h-[600px] hidden 2xl:flex items-center justify-center bg-[#0c0c0c]/50 z-40 pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <AdSlot adSlot="3061811673" className="w-full h-full" />
        </div>
      </div>
      
      {/* 오른쪽 사이드 광고 */}
      <div className="fixed right-4 top-[150px] w-[160px] h-[600px] hidden 2xl:flex items-center justify-center bg-[#0c0c0c]/50 z-40 pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <AdSlot adSlot="3061811673" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}