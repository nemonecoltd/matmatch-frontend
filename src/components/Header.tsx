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
    <header className="fixed top-0 left-0 w-full z-[100] bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-10 py-3 md:py-8 gap-3 md:gap-0">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <BackButton />
          <Link href="/" className="text-[#D4AF37] text-2xl md:text-4xl font-[900] italic tracking-[-0.07em] hover:opacity-80 transition-opacity select-none flex-shrink-0">
            네모네AIM
          </Link>
          <a 
            href="https://now.nemoneai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-emerald-500 border border-emerald-400 text-white text-[10px] md:text-[11px] font-black italic rounded-md hover:bg-emerald-600 transition-all shadow-sm tracking-tighter flex-shrink-0"
          >
            Nowhere
          </a>
        </div>

        {/* 모바일 우측 (프로필/로그인) */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="https://now.nemoneai.com/my" title="통합 마이페이지" className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
                  <img 
                    src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'U')}&background=random`} 
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-[9px] font-bold text-zinc-500 hover:text-[#D4AF37] uppercase tracking-widest transition-colors"
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
      </div>

      <div className="flex-grow w-full md:w-auto max-w-md md:mx-8">
        <Suspense fallback={<div className="w-full h-10 bg-white/5 rounded-full" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* 데스크탑 우측 (Nav & 프로필/로그인) */}
      <div className="hidden md:flex items-center gap-8 flex-shrink-0">
        <NavLinks />
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="https://now.nemoneai.com/my" title="통합 마이페이지로 이동" className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
                <img 
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'U')}&background=random`} 
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-[10px] font-bold text-zinc-500 hover:text-[#D4AF37] uppercase tracking-widest transition-colors"
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
              <UserIcon size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
