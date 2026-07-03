"use client";

import Link from 'next/link';

export default function ViewAdSlot() {
  return (
    <div className="w-full max-w-5xl mx-auto mb-10 px-6">
      {/* 자체 배너 슬롯: 네이버 스마트스토어 */}
      <Link 
        href="https://smartstore.naver.com/nemone24" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full overflow-hidden rounded-3xl border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-2xl"
      >
        <img 
          src="/nemone_banner2.jpg"
          alt="Nemone Store Banner" 
          className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
        />
      </Link>
    </div>
  );
}
