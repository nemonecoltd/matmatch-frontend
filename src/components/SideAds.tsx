"use client";

import { useEffect, useState } from 'react';
import AdSlot from './AdSlot';
import { usePathname } from 'next/navigation';

// 기사 페이지 히어로(660px, posts/[id]/page.tsx와 동일 값) 지나면 사이드 광고 숨김
// — 기사페이지개편_지시서 5장 "안 A" 채택(사용자 확인, 2026-09-05). 매출 영향을
// 줄이려고 언마운트 대신 CSS로만 숨겨 AdSlot의 adsbygoogle push는 유지한다.
const ARTICLE_HERO_HEIGHT = 640;

export default function SideAds() {
  const pathname = usePathname();
  const isArticle = pathname?.startsWith('/posts/') ?? false;
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isArticle) return;
    const onScroll = () => setPastHero(window.scrollY > ARTICLE_HERO_HEIGHT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isArticle]);

  // 스페셜 관련 페이지에서는 광고 숨김 처리
  if (pathname?.startsWith('/special')) {
    return null;
  }

  const hidden = isArticle && pastHero;

  return (
    <>
      {/* 왼쪽 사이드 광고: 화면이 넓을 때만 (2xl 이상) 보이고 컨텐츠 바깥에 고정 */}
      <div className={`fixed left-4 top-[150px] w-[160px] h-[600px] items-center justify-center bg-[#0c0c0c]/50 z-40 pointer-events-none ${hidden ? 'hidden' : 'hidden 2xl:flex'}`}>
        <div className="pointer-events-auto w-full h-full">
          <AdSlot adSlot="3061811673" className="w-full h-full" />
        </div>
      </div>

      {/* 오른쪽 사이드 광고 */}
      <div className={`fixed right-4 top-[150px] w-[160px] h-[600px] items-center justify-center bg-[#0c0c0c]/50 z-40 pointer-events-none ${hidden ? 'hidden' : 'hidden 2xl:flex'}`}>
        <div className="pointer-events-auto w-full h-full">
          <AdSlot adSlot="3061811673" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}