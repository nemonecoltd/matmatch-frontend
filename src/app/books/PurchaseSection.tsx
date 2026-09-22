'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * CTA·가격 카드 — 앱에서는 통째로 숨긴다(지시서 7장).
 *
 * 구글플레이 결제 정책상 앱 안에서 소비되는 디지털 콘텐츠의 구매 동선은 정책 적용 대상이다.
 * 그래서 앱에서는 '구매'라는 개념이 존재하지 않는 것처럼 보여야 하고, "웹에서 구매하세요"
 * 같은 안내 문구조차 넣지 않는다(스티어링으로 해석될 수 있음).
 *
 * 분기를 서버 UA로 하지 않는 이유(지시서 7장): 서버에서 UA로 갈라버리면 크롤러가 받는 HTML이
 * 요청마다 달라져 정적 렌더 원칙과 충돌한다. 대신 네이티브 셸이 주입하는
 * window.__NEMONE_APP__ 플래그를 **클라이언트에서** 읽어 렌더 여부만 정한다.
 * 서버가 내려주는 HTML은 웹·앱·크롤러 모두 동일하다.
 *
 * 플래그가 없을 때(=일반 웹)가 기본값이다. 다만 hydration 불일치를 피하려고 첫 렌더에서는
 * 서버와 같은 결과를 그린 뒤, 마운트 이후에 앱이면 감춘다.
 *
 * 2026-09-22: 앱이 실제로 이 플래그를 주입하는지 확인되지 않아(WebView 래퍼 빌더 툴 사용,
 * 주입 설정 미확인) 구매 버튼이 앱에서도 노출되는 사고 발생. 근본 수정(앱 쪽 플래그 주입
 * 확인) 전까지 임시로 `md:` 브레이크포인트 이상에서만 노출 — 앱은 항상 모바일 폭이므로
 * 뷰포트 기준으로도 동일하게 가려진다. 데스크톱 웹 구매 노출은 그대로 유지.
 */
interface Props {
  bookSlug: string;
  variant: 'hero' | 'pricing';
}

declare global {
  interface Window {
    __NEMONE_APP__?: boolean;
  }
}

export default function PurchaseSection({ bookSlug, variant }: Props) {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(Boolean(window.__NEMONE_APP__));
  }, []);

  // 무료 읽기 동선은 앱에서도 그대로 살린다 — 구매가 아니라 열람이기 때문.
  const freeReadLink = (
    <Link
      href={`/books/${bookSlug}/prologue`}
      className="inline-flex items-center justify-center rounded-sm border border-white/25 px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-white no-underline transition-colors hover:border-white/60"
    >
      프롤로그 무료로 읽기
    </Link>
  );

  if (variant === 'hero') {
    return (
      <div className="flex flex-wrap gap-3">
        {!isApp && (
          <Link
            href={`/checkout/${bookSlug}`}
            className="hidden items-center justify-center rounded-sm bg-[#D4AF37] px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-[#0c0c0c] no-underline transition-opacity hover:opacity-85 md:inline-flex"
          >
            전권 구매하기
          </Link>
        )}
        {freeReadLink}
      </div>
    );
  }

  // 앱에서는 가격 섹션 자체를 렌더하지 않는다(가격 노출도 구매 동선의 일부).
  if (isApp) return null;

  // Phase 1은 결제 미연동 — 가격은 확정 전이라 비워두고 구성만 보여준다(지시서 11장 Out of Scope).
  const plans = [
    { name: '전권', desc: '프롤로그 + 23장 + 에필로그', price: '', highlight: true },
    { name: '부별', desc: '원하는 부만 선택 구매', price: '', highlight: false },
    { name: '전권 + 오디오', desc: '전권 + 낭독 오디오북', price: '', highlight: false },
  ];

  return (
    <section id="pricing" className="hidden scroll-mt-28 md:block">
      <h2 className="mb-10 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">Price</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-sm border p-6 ${
              plan.highlight ? 'border-[#D4AF37]/60 bg-[#D4AF37]/5' : 'border-white/10'
            }`}
          >
            <h3
              className={`mb-2 text-base font-bold not-italic ${
                plan.highlight ? 'text-[#D4AF37]' : 'text-white'
              }`}
            >
              {plan.name}
            </h3>
            <p className="mb-6 break-keep text-[13px] font-light leading-relaxed text-white/50">
              {plan.desc}
            </p>
            <p className="mt-auto text-sm font-bold text-white/70">
              {plan.price || <span className="text-white/35">가격 준비 중</span>}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[12px] font-light text-white/35">
        결제 기능은 준비 중입니다. 프롤로그와 1부는 지금 바로 무료로 읽으실 수 있습니다.
      </p>
    </section>
  );
}
