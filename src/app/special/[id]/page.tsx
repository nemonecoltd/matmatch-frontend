import React from 'react';
import { Metadata } from "next";
import Link from 'next/link';
import { ChevronRight, Mail } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import InFeedAd from '@/components/InFeedAd';
import Header from '@/components/Header';

// 2026-09-06 페이징 추가(6c17baa) 이후 이 페이지가 전부 500 에러였음(2026-09-21 발견,
// Search Console에서 5xx 보고로 확인 — 6개 스페셜 전체가 대상, 특정 id 문제가 아니었음).
// 원인: searchParams(페이지네이션, 요청마다 달라짐)를 읽는데 generateStaticParams가 있어
// Next.js가 이 라우트를 "정적으로 생성 가능한 경로"로 보고 빌드 시점/요청 시점에 정적
// 생성을 시도한다 — 그 시도 도중 searchParams(요청별 값, 빌드 시점엔 존재 자체가 불가능)를
// 읽는 순간 DYNAMIC_SERVER_USAGE로 크래시한다. revalidate=3600만 지우는 걸로는 안 고쳐졌음
// (2026-09-21 1차 시도 — 재배포 후에도 동일 에러로 실패 확인) — generateStaticParams가
// 있는 한 Next가 계속 정적 생성을 시도하기 때문. force-dynamic으로 이 라우트를 정적 생성
// 후보에서 아예 제외해야 한다(요청마다 서버에서 새로 렌더 — ISR 캐싱 이득은 포기).
export const dynamic = 'force-dynamic';

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
    const title = `${data.title} | NEMONE ORIGINALS`;
    const description = data.description || '네모네AIM이 큐레이션한 프리미엄 기사 묶음 시리즈';
    const imageUrl = getThumbnail(data.bg_image_url) || 'https://nemoneai.com/banner_store.jpg';
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
      title: `NEMONE ORIGINALS #${id} | 네모네AIM`,
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

const PAGE_SIZE = 10;

export default async function SpecialDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));
  let data: any = null;
  try {
    const res = await fetch(`http://127.0.0.1:8080/specials/${id}`);
    data = await res.json();
  } catch (e) { console.error(e); }

  if (!data) return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-[#D4AF37] font-serif italic text-2xl">Loading...</div>;

  const allPosts = data.posts || [];
  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  const pagedPosts = allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.description,
    url: `https://nemoneai.com/special/${id}`,
    image: getThumbnail(data.bg_image_url) || 'https://nemoneai.com/banner_store.jpg',
    publisher: { '@type': 'Organization', name: '네모네 주식회사', url: 'https://nemoneai.com' },
  };

  return (
    <div className="bg-[#0c0c0c] text-white selection:bg-[#D4AF37] selection:text-black font-serif italic overflow-x-hidden min-h-screen flex flex-col pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20">
        {data.bg_image_url && (
          <div className="absolute top-0 left-0 w-full h-[75vh] z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-cover bg-center md:bg-fixed opacity-60" style={{ backgroundImage: `url(${getThumbnail(data.bg_image_url)})` }} />
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
            {pagedPosts.length > 0 ? pagedPosts.map((post: any, idx: number) => (
              <React.Fragment key={post.id}>
              <Link href={`/posts/${post.id}`} className="group flex flex-col md:flex-row gap-10 items-center no-underline border-b border-white/5 pb-6 last:border-0">
                <div className="relative w-full md:w-[400px] aspect-video rounded-[30px] overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                  <img src={getThumbnail(post.image_url)} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute top-6 left-6 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] font-black text-sm italic">
                    {(page - 1) * PAGE_SIZE + idx + 1}
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
              {idx === 1 && <InFeedAd />}
              </React.Fragment>
            )) : (
              <div className="py-20 text-center text-white/20 italic">No stories linked to this series yet.</div>
            )}
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-12">
              {page > 1 ? (
                <Link
                  href={`/special/${id}?page=${page - 1}`}
                  className="px-6 py-2.5 border border-white/20 rounded-full text-sm font-black uppercase tracking-widest text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all not-italic"
                >
                  ← Prev
                </Link>
              ) : (
                <span className="px-6 py-2.5 w-24" />
              )}

              <span className="text-white/20 text-xs font-black uppercase tracking-widest not-italic">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/special/${id}?page=${page + 1}`}
                  className="px-6 py-2.5 border border-white/20 rounded-full text-sm font-black uppercase tracking-widest text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all not-italic"
                >
                  Next →
                </Link>
              ) : (
                <span className="px-6 py-2.5 w-24" />
              )}
            </div>
          )}
        </div>
      </section>

      <BottomTabBar activeCategory="SPECIAL" />
    </div>
  );
}
