'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/**
 * 목차 행 우측의 상태 배지 — 이 파일만 클라이언트 컴포넌트다(지시서 2-1장).
 *
 * 왜 이렇게까지 잘게 쪼개는가: 구매 여부는 클라이언트 시점에만 알 수 있는 정보인데,
 * 이걸 목차 전체를 감싸는 방식으로 처리하면 23개 장 제목이 통째로 크롤러에게 사라진다.
 * 실제로 과거 홈에서 useSearchParams + Suspense 조합으로 5일간 본문 전체가 빈 화면으로
 * 나간 사고가 있었다(matmatch_now_SEO_대응_히스토리 3장).
 *
 * 그래서 지켜야 할 규칙:
 *  - 장 번호·제목 등 텍스트는 서버 컴포넌트(ChapterRow)가 렌더하고, 여기선 배지만 그린다.
 *  - 기본 상태를 **즉시** 렌더한다(무료면 '무료 · 읽기', 유료면 '구매 후 열람').
 *    세션 확인이 끝난 뒤에만 구매자용 '이어읽기'로 교체한다(progressive enhancement).
 *  - <Suspense fallback={null}>로 감싸지 않는다. 기존 Header의 로그인 위젯과 같은 패턴.
 */
interface Props {
  bookSlug: string;
  chapterSlug: string;
  isFree: boolean;
}

/**
 * 보유 상품 조회는 배지마다 하지 않고 책 단위로 한 번만 한다.
 * 목차에 배지가 19개(유료 장 수)라 각자 fetch하면 같은 요청이 19번 나간다 — 같은
 * (책, 토큰) 조합의 요청 하나를 모듈 스코프에서 공유한다.
 */
const productsCache = new Map<string, Promise<Set<string>>>();

async function fetchOwnedProducts(bookSlug: string, token: string): Promise<Set<string>> {
  const key = `${bookSlug}:${token}`;
  const cached = productsCache.get(key);
  if (cached) return cached;

  const p = (async () => {
    const res = await fetch(`/api/entitlements/chapters?book=${encodeURIComponent(bookSlug)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return new Set<string>();
    const data = await res.json();
    return new Set<string>(Array.isArray(data?.products) ? data.products : []);
  })().catch(() => new Set<string>());

  productsCache.set(key, p);
  return p;
}

/** 권한 판정은 서버(books_api.can_read)가 원본이고, 여기선 배지 표시용으로만 같은 규칙을 쓴다. */
function canRead(chapterSlug: string, bookSlug: string, products: Set<string>): boolean {
  if (products.has(`${bookSlug}:full`)) return true;
  const m = /^p(\d+)c\d+$/.exec(chapterSlug);
  return m !== null && products.has(`${bookSlug}:p${m[1]}`);
}

export default function EntitlementBadge({ bookSlug, chapterSlug, isFree }: Props) {
  const { session } = useAuth();
  const [owned, setOwned] = useState(false);
  const token = session?.access_token;

  useEffect(() => {
    // 무료 장은 권한 조회 자체가 불필요. 비로그인도 마찬가지.
    if (isFree || !token) {
      setOwned(false);
      return;
    }
    let alive = true;
    fetchOwnedProducts(bookSlug, token).then((products) => {
      if (alive) setOwned(canRead(chapterSlug, bookSlug, products));
    });
    return () => {
      alive = false;
    };
  }, [bookSlug, chapterSlug, isFree, token]);

  if (isFree) {
    return (
      <Link
        href={`/books/${bookSlug}/${chapterSlug}`}
        className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-[#D4AF37] hover:text-white transition-colors no-underline"
      >
        무료 · 읽기 →
      </Link>
    );
  }

  if (owned) {
    return (
      <Link
        href={`/library/${bookSlug}/${chapterSlug}`}
        className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-[#D4AF37] hover:text-white transition-colors no-underline"
      >
        이어읽기 →
      </Link>
    );
  }

  return (
    <span className="shrink-0 text-[11px] font-medium tracking-[0.12em] text-white/30">
      구매 후 열람
    </span>
  );
}
