import React from 'react';
// import Script from 'next/script'; // Script 컴포넌트 제거
import Footer from '@/components/Footer'; // Footer 임포트 추가

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0c0c] font-serif italic selection:bg-[#D4AF37] selection:text-black">
      {/* 애드센스 스크립트 무결성 유지 */}
      {/* Script 컴포넌트 제거 */}

      <main className="pb-[5.5rem]"> {/* 하단 탭바 높이 (56px + padding) 만큼 padding-bottom 추가 */}
        {children}
      </main>
      <Footer /> {/* 푸터 컴포넌트 추가 */}
    </div>
  );
}