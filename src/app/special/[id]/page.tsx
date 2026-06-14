import React from 'react';
import { Metadata } from "next";
import Link from 'next/link';
import { ChevronRight, Mail } from 'lucide-react';
import NavLinks from '@/components/NavLinks';
import BottomTabBar from '@/components/BottomTabBar';
import BackButton from '@/components/BackButton';

export const revalidate = 3600;

const getThumbnail = (url: string) => {
  if (!url) return "";
  if (url.startsWith('/thumbnails')) {
    return `https://nemoneai.com${url}`;
  }
  return url;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`http://127.0.0.1:8080/specials/${id}`);
    const data = await res.json();
    const title = `${data.title} | 네모네AIM Special`;
    const description = data.description || '네모네AIM이 큐레이션한 프리미엄 기사 묶음 시리즈';
    const imageUrl = getThumbnail(data.bg_image_url) || 'https://nemoneai.com/banner_store.png';
    return {
      title,
      description,
      keywords: data.tags,
      alternates: { canonical: `https://nemoneai.com/special/${id}` },
      openGraph: {
        title,
        description,
        url: `https://nemoneai.com/special/${id}`,
        siteName: '네모네AIM',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: data.title }],
        locale: 'ko_KR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (e) {
    return {
      title: `Special Series #${id} | 네모네AIM`,
      description: "네모네AIM이 큐레이션한 프리미엄 기사 묶음 시리즈",
      alternates: { canonical: `https://nemoneai.com/special/${id}` },
    };
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch('http://127.0.0.1:8080/specials');
    const specials = await res.json();
    return specials.map((s: any) => ({ id: s.id.toString() }));
  } catch (e) { return []; }
}

export default async function SpecialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: any = null;
  try {
    const res = await fetch(`http://127.0.0.1:8080/specials/${id}`);
    data = await res.json();
  } catch (e) { console.error(e); }

  if (!data) return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-[#D4AF37] font-serif italic text-2xl">Loading...</div>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.description,
    url: `https://nemoneai.com/special/${id}`,
    image: getThumbnail(data.bg_image_url) || 'https://nemoneai.com/banner_store.png',
    publisher: { '@type': 'Organization', name: '네모네 주식회사', url: 'https://nemoneai.com' },
  };

  return (
    <div className="bg-[#0c0c0c] text-white selection:bg-[#D4AF37] selection:text-black font-serif italic overflow-x-hidden min-h-screen flex flex-col pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-10 py-4 md:py-8 flex justify-between items-center bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <BackButton />
          <Link href="/" className="text-[#D4AF37] text-2xl md:text-4xl font-[900] italic tracking-[-0.07em] hover:opacity-80 transition-opacity flex-shrink-0">
            네모네AIM
          </Link>
        </div>
        <NavLinks activeCategory="SPECIAL" />
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20">
        {data.bg_image_url && (
          <div className="absolute top-0 left-0 w-full h-[75vh] z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60" style={{ backgroundImage: `url(${getThumbnail(data.bg_image_url)})` }} />
            {/* 하단으로 갈수록 블랙과 섞이는 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0c0c0c] backdrop-blur-[2px]" />
          </div>
        )}
        
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 mt-10">
          <header className="mb-12 text-left max-w-5xl">
            <div className="text-[#D4AF37] text-sm font-black tracking-[0.5em] uppercase mb-4 not-italic border-l-4 border-[#D4AF37] pl-6">
              Special Collection
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] italic leading-[1.1] break-keep mb-8 tracking-tighter">
              {data.title}
            </h1>

            {/* 글쓴이 및 날짜 메타 정보 섹션 */}
            <div className="flex justify-between items-center py-8 border-y border-white/10 text-sm tracking-widest font-bold uppercase not-italic">
              <div className="flex items-center gap-4">
                <span className="text-white/40">Curated by</span>
                <span className="text-white uppercase">네모네AIM Team</span>
                <a href="mailto:nemonecoltd@gmail.com" className="text-[#D4AF37] hover:text-white transition-colors ml-2">
                  <Mail size={18} />
                </a>
              </div>
              <div className="text-white/30 font-light">
                {data.posts?.length || 0} Stories Included
              </div>
            </div>
            
            <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light italic mt-8 max-w-4xl">
              {data.description}
            </p>

            {data.tags && (
              <div className="flex flex-wrap gap-3 mt-10">
                {data.tags.split(',').map((tag: string) => tag.trim() && (
                  <span key={tag} className="px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-[11px] font-black uppercase tracking-wider italic hover:bg-[#D4AF37]/20 transition-all cursor-pointer select-none">
                    # {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* POSTS LIST */}
          <div className="mt-16 space-y-6">
            {data.posts && data.posts.length > 0 ? data.posts.map((post: any, idx: number) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group flex flex-col md:flex-row gap-10 items-center no-underline border-b border-white/5 pb-6 last:border-0">
                <div className="relative w-full md:w-[400px] aspect-video rounded-[30px] overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                  <img src={getThumbnail(post.image_url)} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute top-6 left-6 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] font-black text-sm italic">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase not-italic mb-4 block px-2 py-1 border border-[#D4AF37]/30 rounded w-fit">
                    {post.category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black italic text-white group-hover:text-[#D4AF37] transition-colors duration-500 leading-tight tracking-tight mb-4">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-sm md:text-base line-clamp-2 leading-relaxed font-light">
                    {(post.body_text || "").replace(/<[^>]*>?/gm, '')}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-white/20 group-hover:text-[#D4AF37] transition-colors text-[10px] font-black tracking-[0.2em] uppercase not-italic">
                    Read Full Story <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            )) : (
              <div className="py-20 text-center text-white/20 italic">No stories linked to this series yet.</div>
            )}
          </div>
        </div>
      </section>

      <BottomTabBar activeCategory="SPECIAL" />
    </div>
  );
}
