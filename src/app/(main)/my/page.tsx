"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Heart, LogOut, Settings, ExternalLink } from 'lucide-react';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.nemoneai.com';

// 계정은 하나인데 서비스끼리 이동할 동선이 없어서 하단에 배치(PACE 마이페이지와 동일 패턴).
// 맛매치(AIM)는 이 페이지 자신이라 목록에서 제외.
const NEMONE_SERVICES = [
  { name: 'NEMONE PACE', href: 'https://now.nemoneai.com', icon: '🗺️', desc: '당신의 다음 3시간을 설계합니다' },
  { name: 'NEMONE PLANTS', href: 'https://plants.nemoneai.com', icon: '🪴', desc: '식물도감 & 케어 가이드' },
  { name: 'NEMONE MSM', href: 'https://msm.nemoneai.com', icon: '📈', desc: '국내 주식 AI 분석' },
];

type LikedPost = {
  id: number;
  title: string;
  category: string | null;
  image_url: string | null;
  created_at: string | null;
};

export default function MyPage() {
  const { user, isLoading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [posts, setPosts] = useState<LikedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(user.id)}/likes`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [user, authLoading, load]);

  if (authLoading || loading) {
    return <div className="max-w-5xl mx-auto px-6 py-20 text-center text-xs text-white/30">불러오는 중…</div>;
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-xl font-black text-[#D4AF37] tracking-tight mb-3">MY PAGE</h1>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          마음에 드는 기사를 찜하고
          <br />
          언제든 다시 찾아보세요.
        </p>
        <button
          onClick={() => signInWithGoogle()}
          className="px-8 py-3 rounded-full bg-[#D4AF37] text-black text-sm font-bold hover:opacity-90 transition-opacity"
        >
          네모네 계정으로 로그인
        </button>
      </div>
    );
  }

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '회원';
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* 프로필 — 이름/사진은 네모네 공용 계정 정보라 수정은 인증 센터로 */}
      <section className="flex items-center gap-5 pb-8 border-b border-white/10">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 bg-white/5 flex-shrink-0">
          {avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-black text-lg">
              {name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-white tracking-tight truncate">{name}</h1>
          <p className="text-[11px] text-white/30 truncate">{user.email}</p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <a
            href={`${AUTH_URL}/profile?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 hover:text-[#D4AF37] transition-colors"
          >
            <Settings size={13} /> 계정 관리
          </a>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/60 transition-colors"
          >
            <LogOut size={13} /> 로그아웃
          </button>
        </div>
      </section>

      {/* 찜한 기사 */}
      <section className="py-8">
        <h2 className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-5">
          <Heart size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
          찜한 기사 ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <p className="text-sm text-white/30 py-6">
            아직 찜한 기사가 없어요.{' '}
            <Link href="/" className="text-[#D4AF37] underline">
              기사 둘러보기
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/posts/${p.id}`}
                className="group block bg-white/[.02] border border-white/[.07] rounded-lg overflow-hidden hover:border-[#D4AF37]/30 transition-colors no-underline"
              >
                <div className="relative aspect-[16/10] bg-white/5">
                  {p.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/15 text-[10px]">
                      NO IMAGE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {p.category && (
                    <div className="text-[9px] font-black text-[#D4AF37]/70 uppercase tracking-widest mb-1.5">
                      {p.category}
                    </div>
                  )}
                  <div className="text-sm font-bold text-white/90 leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                    {p.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 네모네 다른 서비스 */}
      <section className="pt-8 border-t border-white/10">
        <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-5">
          네모네의 다른 서비스
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {NEMONE_SERVICES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/[.02] border border-white/[.07] rounded-lg px-4 py-3.5 hover:border-[#D4AF37]/25 transition-colors no-underline"
            >
              <span className="text-lg flex-shrink-0">{s.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white/90 truncate">{s.name}</p>
                <p className="text-[10px] text-white/30 truncate">{s.desc}</p>
              </div>
              <ExternalLink size={12} className="text-white/20 flex-shrink-0" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
