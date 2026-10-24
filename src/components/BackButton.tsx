"use client";

import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // AIM 홈("/aim")에서는 뒤로가기 버튼을 표시하지 않음 (포털 "/"은 이 헤더를 쓰지 않는다)
  if (pathname === '/aim' || pathname === '/') return null;

  return (
    <button 
      onClick={() => router.back()} 
      className="p-1 -ml-2 mr-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
      aria-label="뒤로 가기"
    >
      <ChevronLeft size={28} className="text-white opacity-80" />
    </button>
  );
}
