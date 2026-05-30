"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, Zap, Mic, FileText, ChevronDown } from 'lucide-react';
import AdSlot from '@/components/AdSlot';

const getThumbnail = (postOrUrl: any) => {
  if (typeof postOrUrl === 'string') {
    if (postOrUrl.startsWith('/thumbnails')) {
      return `https://nemoneai.com${postOrUrl}`;
    }
    return postOrUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
  }
  
  const post = postOrUrl;
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.image_url) {
    if (post.image_url.startsWith('/thumbnails')) {
      return `https://nemoneai.com${post.image_url}`;
    }
    return post.image_url;
  }
  const vUrl = post.video_url || post.youtube_url || "";
  const youtubeMatch = vUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^\"&?\/\s]{11})/i);
  if (youtubeMatch) return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  if (vUrl.includes('spotify.com')) return "/podcast_default.jpg";
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
};

export default function HomeContent({ initialPosts, rankingData = [], mainSpecial = null }: { initialPosts: any[], rankingData?: any[], mainSpecial?: any }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery]);

  const filteredPosts = initialPosts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) || 
      post.body_text?.toLowerCase().includes(query) ||
      post.category?.toLowerCase().includes(query) ||
      post.tags?.toLowerCase().includes(query)
    );
  });
  
  const isSearching = searchQuery.length > 0;
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  return (
    <>
      <div className={isSearching ? "flex flex-col gap-12 max-w-5xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-16"}>
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post, idx) => {
            if (isSearching) {
              return (
                <Link key={post.id} href={`/posts/${post.id}`} className="group flex flex-col md:flex-row gap-8 items-center border-b border-white/5 pb-12 no-underline">
                  <div className="w-full md:w-64 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                    <img 
                      src={getThumbnail(post)} 
                      alt={post.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="flex-grow flex flex-col gap-3 py-2 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase not-italic px-2 py-0.5 border border-[#D4AF37]/30 rounded">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-3xl font-black italic group-hover:text-[#D4AF37] transition-colors duration-500 leading-tight tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-white/40 text-sm line-clamp-2 leading-relaxed font-light">
                      {(post.body_text || post.content || "").replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                </Link>
              );
            }

            const isHero = idx === 0;
            const gridClass = isHero ? 'md:col-span-2 lg:col-span-3 mb-0' : '';
            const imageClass = isHero ? "aspect-[21/9] rounded-[60px]" : "aspect-video rounded-[30px]";
            
            const vUrl = post.video_url || post.youtube_url || "";
            let contentType = 'blog';
            if (vUrl.includes('youtube.com') || vUrl.includes('youtu.be')) {
              contentType = vUrl.includes('/shorts/') ? 'shorts' : 'youtube';
            } else if (vUrl.includes('spotify.com')) {
              contentType = 'podcast';
            }

            return (
              <React.Fragment key={post.id || idx}>
                <Link href={`/posts/${post.id}`} className={`group flex flex-col no-underline ${gridClass}`}>
                  <article className="flex flex-col w-full text-left">
                    <div className={`relative overflow-hidden bg-[#111] border border-white/5 shadow-2xl transition-all duration-1000 group-hover:border-[#D4AF37]/30 ${imageClass} mb-5`}>
                      <img 
                        src={getThumbnail(post)} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-[1500ms]" 
                        alt={post.title} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-black/40 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                          {contentType === 'shorts' && <Zap fill="#D4AF37" className="text-[#D4AF37]" size={28} />}
                          {contentType === 'youtube' && <Play fill="white" className="text-white ml-1" size={28} />}
                          {contentType === 'podcast' && <Mic className="text-[#D4AF37]" size={28} />}
                          {contentType === 'blog' && <FileText className="text-white" size={28} />}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 px-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[#D4AF37] text-xs font-black tracking-[0.3em] uppercase not-italic">
                          {post.category || "Journal"}
                        </span>
                        {contentType === 'podcast' && <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest not-italic border border-[#D4AF37]/30 px-2 py-0.5 rounded">PODCAST</span>}
                      </div>
                      <h2 className={`${isHero ? 'text-4xl md:text-7xl lg:text-8xl' : 'text-xl md:text-3xl'} font-[900] italic leading-[1.1] tracking-tighter group-hover:text-[#D4AF37] transition-colors duration-500`}>
                        {post.title}
                      </h2>
                      <p className={`${isHero ? 'text-base md:text-xl max-w-4xl' : 'text-sm md:text-base'} text-white/50 leading-relaxed line-clamp-2 font-light`}>
                        {(post.body_text || post.content || "").replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  </article>
                </Link>

                {isHero && (
                  <div className="md:col-span-2 lg:col-span-3 w-full mt-2 md:mt-4 mb-4">
                    {/* 자체 배너 슬롯: 네이버 스마트스토어 */}
                    <Link 
                      href="https://smartstore.naver.com/nemone24" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full mb-12 overflow-hidden rounded-3xl border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-2xl"
                    >
                      <img 
                        src="/banner_store.png" 
                        alt="Nemone Store Banner" 
                        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
                      />
                    </Link>

                    {mainSpecial && (
                      <Link href={`/special/${mainSpecial.id}`} className="group block w-full bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-3xl p-6 mb-12 no-underline hover:border-[#D4AF37] transition-all">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden flex-shrink-0 bg-black/40">
                            <img src={getThumbnail(mainSpecial.bg_image_url)} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase italic mb-2 block">Special Selection</span>
                            <h3 className="text-2xl md:text-3xl font-black italic text-white mb-2 tracking-tighter group-hover:text-[#D4AF37] transition-colors">{mainSpecial.title}</h3>
                            <p className="text-white/50 text-sm md:text-base line-clamp-2 font-light italic leading-relaxed">{mainSpecial.description}</p>
                          </div>
                        </div>
                      </Link>
                    )}

                    {rankingData.length > 0 && (
                      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase italic">Weekly Ranking TOP 3</span>
                          <div className="h-[1px] flex-grow bg-[#D4AF37]/20"></div>
                        </div>
                        <div className="flex flex-col gap-4">
                          {rankingData.map((item, index) => (
                            <Link key={item.id} href={`/posts/${item.id}`} className="group flex items-center gap-6 no-underline border-b border-white/5 pb-3 last:border-0 last:pb-0">
                              <span className="text-2xl md:text-3xl font-[900] italic text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors">0{index + 1}</span>
                              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-grow overflow-hidden">
                                <span className="text-[9px] font-black tracking-widest uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded w-fit flex-shrink-0">{item.category}</span>
                                <span className="text-base md:text-lg font-bold italic text-white/80 group-hover:text-white transition-colors truncate">
                                  {item.title}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center py-40 border border-white/5 rounded-[60px] bg-white/5">
            <p className="text-[#D4AF37] text-xl font-black italic tracking-widest uppercase opacity-30">No matches found.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-32 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 9)}
            className="group flex flex-col items-center gap-4 text-[#D4AF37] hover:text-white transition-colors duration-500"
          >
            <span className="text-xs font-black tracking-[0.5em] uppercase italic">More Stories</span>
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:border-white/50 transition-all duration-500">
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform duration-500" />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
