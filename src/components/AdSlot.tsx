"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSlotProps {
  adSlot: string;
  className?: string;
  // 2026-10-03 매출개선 작업 — 구글이 반응형 광고를 세로로 길게 키우는 걸 막고 싶을 때
  // (히어로 바로 밑처럼 레이아웃이 꽉 찬 자리) true로. plants/frontend의
  // AdBanner variant="horizontal-slim"과 동일한 패턴(.ad-banner-slim, globals.css).
  slim?: boolean;
}

export default function AdSlot({ adSlot, className, slim }: AdSlotProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err: any) {
      if (!err.message?.includes("already have ads")) {
        console.error("AdSense push error:", err);
      }
    }
  }, [pathname, adSlot]);

  return (
    <div className={className} style={{ width: '100%', overflow: 'hidden' }}>
      <ins
        className={`adsbygoogle${slim ? ' ad-banner-slim' : ''}`}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4274957638983041"
        data-ad-slot={adSlot}
        data-ad-format={slim ? 'horizontal' : 'auto'}
        data-full-width-responsive={slim ? 'false' : 'true'}
      />
    </div>
  );
}
