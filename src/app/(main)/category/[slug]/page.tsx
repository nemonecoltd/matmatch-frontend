import React from 'react';
import { Metadata } from "next";
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60;

interface CategoryPageProps {
  params: { slug: string };
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  Taste: { title: "미식", description: "네모네AIM이 엄선한 미식 콘텐츠. 맛의문명사, 최고의대료를 찾아서 등 풍성한 미식 이야기를 만나보세요." },
  Culture: { title: "문화", description: "예술, 여행, 건축, 드라마 등 네모네AIM이 큐레이션한 문화 콘텐츠를 경험하세요." },
  Life: { title: "라이프", description: "마인드셋, 세뇌의기술, 라이프스타일 등 삶의 질을 높이는 네모네AIM의 라이프 콘텐츠." },
  Tech: { title: "테크", description: "AI, 스타트업, 가젯 등 네모네AIM이 바라보는 기술과 혁신 이야기." },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const meta = CATEGORY_META[params.slug] || { title: `${params.slug} | 네모네AIM`, description: "네모네AIM 콘텐츠." };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://nemoneai.com/category/${params.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://nemoneai.com/category/${params.slug}`,
      siteName: '네모네AIM',
      locale: 'ko_KR',
      type: 'website',
    },
  };
}

// SSG를 위한 정적 경로 생성
export async function generateStaticParams() {
  return [
    { slug: 'Taste' },
    { slug: 'Culture' },
    { slug: 'Life' },
    { slug: 'Tech' }
  ];
}

const getThumbnail = (post: any) => {
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.image_url) return post.image_url;
  const vUrl = post.video_url || post.youtube_url || "";
  const youtubeMatch = vUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (youtubeMatch) return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  if (vUrl.includes('spotify.com')) return "/podcast_default.jpg";
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  let posts: any[] = [];
  try {
    const res = await fetch(`http://127.0.0.1:8080/posts?category=${slug}`);
    if (res.ok) {
      const data = await res.json();
      posts = Array.isArray(data) ? data : (data.posts || []);
    }
  } catch (error) {
    console.error("Category Fetch Error:", error);
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-serif italic pb-32">
      <main className="max-w-5xl mx-auto px-6 md:px-8 pb-10">
        
        {/* 카테고리 헤더: 여백 및 라인 제거 */}
        <header className="mb-10">
          <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-2 not-italic">Category</p>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">{slug}</h1>
        </header>

        {/* 심플 리스트: 좌측 사진 + 우측 제목 */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <p className="text-white/30 text-xl italic py-20">No stories found in this category.</p>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group flex flex-col md:flex-row gap-8 items-center border-b border-white/5 pb-6 no-underline">
                
                {/* 좌측: 썸네일 (심플하고 정갈한 사이즈) */}
                <div className="w-full md:w-72 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                  <img 
                    src={getThumbnail(post)} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>

                {/* 우측: 제목 및 정보 */}
                <div className="flex-grow flex flex-col gap-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase not-italic px-2 py-0.5 border border-[#D4AF37]/30 rounded">
                      {post.category}
                    </span>
                    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest not-italic">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl font-black italic group-hover:text-[#D4AF37] transition-colors duration-500 leading-tight tracking-tight">
                    {post.title}
                  </h2>
                  
                  <p className="text-white/40 text-sm md:text-base line-clamp-2 leading-relaxed font-light mt-2">
                    {(post.body_text || post.content || "").replace(/<[^>]*>?/gm, '')}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[#D4AF37] text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
                    Read Story <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
