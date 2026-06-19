"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker({ postId }: { postId?: string }) {
  const pathname = usePathname();
  const viewLogged = useRef<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    const timer = setTimeout(() => {
      if (viewLogged.current !== postId) {
        fetch(`/api/analytics/log-view/${postId}`, { method: 'POST' }).catch(() => {});
        viewLogged.current = postId;
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, postId]);

  return null; // 시각적 요소 없음
}
