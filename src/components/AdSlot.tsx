"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface AdSlotProps {
  adSlot: string;
  className?: string;
}

export default function AdSlot({ adSlot, className }: AdSlotProps) {
  const pathname = usePathname();

  useEffect(() => {
    const loadAd = () => {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      } catch (err: any) {
        // 이미 광고가 채워졌다는 에러(TagError)는 무시
        if (!err.message?.includes("already have ads")) {
          console.error("AdSense push error:", err);
        }
      }
    };

    // DOM이 완전히 렌더링된 후 광고를 삽입하기 위해 지연
    const timer = setTimeout(loadAd, 500);
    return () => clearTimeout(timer);
  }, [pathname, adSlot]); // 경로가 바뀌거나 슬롯 ID가 바뀔 때마다 실행

  return (
    <div 
      key={`${pathname}-${adSlot}`} // 키를 부여하여 페이지 전환 시 컴포넌트 강제 재마운트
      className={className} 
      style={{ minHeight: '100px', width: '100%', overflow: 'hidden' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4274957638983041"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
