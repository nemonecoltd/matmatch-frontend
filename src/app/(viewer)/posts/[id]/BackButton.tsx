"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

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
