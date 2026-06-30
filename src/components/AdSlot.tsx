"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSlotProps {
  adSlot: string;
  className?: string;
}

export default function AdSlot({ adSlot, className }: AdSlotProps) {
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
