"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker({ postId }: { postId?: string }) {
  const pathname = usePathname();
  const visitorLogged = useRef(false);
  const viewLogged = useRef<string | null>(null);

  useEffect(() => {
    // 광고가 충분히 로드된 후(5초 뒤)에 조용히 통계를 기록합니다.
    const timer = setTimeout(() => {
      // 1. 방문자 로그
      if (!visitorLogged.current && !sessionStorage.getItem('visitor_logged')) {
        fetch('/api/analytics/log-visitor', { method: 'POST' }).catch(() => {});
        sessionStorage.setItem('visitor_logged', 'true');
        visitorLogged.current = true;
      }

      // 2. 게시물 조회수 로그
      if (postId && viewLogged.current !== postId) {
        fetch(`/api/analytics/log-view/${postId}`, { method: 'POST' }).catch(() => {});
        viewLogged.current = postId;
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, postId]);

  return null; // 시각적 요소 없음
}
