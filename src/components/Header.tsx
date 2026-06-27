'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import SearchBar from '@/components/SearchBar';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/5 flex flex-col">
      {/* 메인 행: 로고 + 검색 + 프로필 */}
      <div className="flex items-center gap-3 px-4 md:px-10 py-3 md:py-5">
        {/* 좌측 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <BackButton />
          <Link href="/" className="text-[#D4AF37] text-base md:text-xl font-black tracking-[0.15em] uppercase not-italic hover:opacity-80 transition-opacity select-none">
            네모네AIM
          </Link>
          <a
            href="https://now.nemoneai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-emerald-500 border border-emerald-400 text-white text-[10px] font-black italic rounded-md hover:bg-emerald-600 transition-all shadow-sm tracking-tighter"
          >
            Nowhere
          </a>
        </div>

        {/* 검색바 — 모바일·데스크탑 모두 표시 */}
        <div className="flex-grow min-w-0">
          <Suspense fallback={<div className="w-full h-8 bg-white/5 rounded-full" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* 우측: 데스크탑 NavLinks + 공통 프로필 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>
          {user ? (
            <>
              <Link href="https://now.nemoneai.com/my" title="통합 마이페이지" className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex-shrink-0">
                <img
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'U')}&background=random`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </Link>
              <button
                onClick={() => signOut()}
                className="hidden md:block text-[9px] font-bold text-zinc-500 hover:text-[#D4AF37] uppercase tracking-widest transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="text-[#D4AF37] hover:text-white transition-colors"
              title="로그인"
            >
              <UserIcon size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 태그라인 띠 */}
      <div className="border-t border-white/5 px-4 md:px-10 py-1.5">
        <p className="text-[9px] md:text-[10px] font-black tracking-[0.25em] uppercase not-italic text-white/25 text-center">
          당신 시간의 알찬 소비&nbsp;&nbsp;·&nbsp;&nbsp;당신 주변의 변화를 관찰합니다
        </p>
      </div>
    </header>
  );
}
