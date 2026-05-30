import React from 'react';
import { Metadata } from "next";
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import NavLinks from '@/components/NavLinks';
import BottomTabBar from '@/components/BottomTabBar';
import BackButton from '@/components/BackButton';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "SPECIAL SERIES | 네모네AIM",
  description: "네모네AIM이 큐레이션한 프리미엄 기사 묶음 시리즈",
  alternates: { canonical: 'https://nemoneai.com/special' },
};

const getThumbnail = (url: string) => {
  if (!url) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
  if (url.startsWith('/thumbnails')) {
    return `https://nemoneai.com${url}`;
  }
  return url;
};

export default async function SpecialListPage() {
  let specials: any[] = [];
  try {
    const res = await fetch('http://127.0.0.1:8080/specials');
    if (res.ok) {
      specials = await res.json();
    }
  } catch (error) {
    console.error("Fetch Specials Error:", error);
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#D4AF37] selection:text-black font-serif italic pb-32">
      <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-10 py-4 md:py-8 flex justify-between items-center bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <BackButton />
          <Link href="/" className="text-[#D4AF37] text-2xl md:text-4xl font-[900] italic tracking-[-0.07em] hover:opacity-80 transition-opacity flex-shrink-0">
            네모네AIM
          </Link>
        </div>
        <NavLinks activeCategory="SPECIAL" />
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-20">
        <div className="mb-10 text-left">
          <div className="text-[#D4AF37] text-sm font-black tracking-[0.5em] uppercase mb-4 not-italic border-l-4 border-[#D4AF37] pl-6">
            ARCHIVE
          </div>
          <h1 className="text-6xl md:text-8xl font-[900] italic leading-[1.1] tracking-tighter mb-4">
            Special Series.
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            깊이 있는 통찰과 미학적인 관점으로 엮어낸 특별한 콘텐츠 컬렉션을 만나보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {specials.length > 0 ? specials.map((special) => (
            <Link key={special.id} href={`/special/${special.id}`} className="group block no-underline">
              <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden bg-[#111] border border-white/5 mb-8">
                <img src={getThumbnail(special.bg_image_url)} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1500ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="flex items-center gap-3 mb-4">
                      <Sparkles size={16} className="text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase not-italic">Featured Series</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black italic text-white leading-tight tracking-tight group-hover:text-[#D4AF37] transition-colors duration-500">
                     {special.title}
                   </h2>
                </div>
              </div>
              <div className="px-4">
                <p className="text-white/40 text-sm md:text-base line-clamp-2 leading-relaxed font-light italic">
                  {special.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#D4AF37] text-[10px] font-black tracking-[0.2em] uppercase not-italic">
                  View Collection <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-40 border border-white/5 rounded-[60px] bg-white/5 text-center">
              <p className="text-[#D4AF37] text-xl font-black italic tracking-widest uppercase opacity-30">No series found.</p>
            </div>
          )}
        </div>
      </main>

      <BottomTabBar activeCategory="SPECIAL" />
    </div>
  );
}
