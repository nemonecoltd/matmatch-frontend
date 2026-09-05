"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Zap, Mic, FileText, ChevronDown } from 'lucide-react';
import TodayStory from './TodayStory';
import NemoneOriginals from './NemoneOriginals';
import FourWorlds from './FourWorlds';
import LatestAndRanking from './LatestAndRanking';
import ArchiveSection from './ArchiveSection';

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

// 2026-09-05 메인 개편: "최신글 나열"에서 편집형 매거진 표지로 재구성
// (TODAY → NEMONE ORIGINALS → FOUR WORLDS → LATEST/RANKING → 나머지 글 → ARCHIVE).
// 로그인 상태 UI(Header/AuthContext)는 이 컴포넌트 트리와 완전히 분리된 layout.tsx
// 레벨에 있어 여기서 손댈 것 없음 — 지시서 2장 가드레일은 이미 충족돼 있음.
export default function HomeContent({
  initialPosts,
  rankingData = [],
  originals = [],
}: {
  initialPosts: any[];
  rankingData?: any[];
  originals?: any[];
}) {
  const [visibleCount, setVisibleCount] = useState(9);

  const todayStory = initialPosts[0];
  const latestStories = initialPosts.slice(1, 4);
  const restPosts = initialPosts.slice(4);
  const visibleRest = restPosts.slice(0, visibleCount);
  const hasMore = restPosts.length > visibleCount;

  if (!todayStory) {
    return (
      <div className="text-center py-40 border border-white/5 rounded-[60px] bg-white/5">
        <p className="text-[#D4AF37] text-xl font-black italic tracking-widest uppercase opacity-30">No matches found.</p>
      </div>
    );
  }

  return (
    <>
      <TodayStory post={todayStory} />
      <NemoneOriginals specials={originals} />
      <FourWorlds />
      <LatestAndRanking latest={latestStories} ranking={rankingData} />

      {restPosts.length > 0 && (
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-16">
            {visibleRest.map((post, idx) => {
              const vUrl = post.video_url || post.youtube_url || "";
              let contentType = 'blog';
              if (vUrl.includes('youtube.com') || vUrl.includes('youtu.be')) {
                contentType = vUrl.includes('/shorts/') ? 'shorts' : 'youtube';
              } else if (vUrl.includes('spotify.com')) {
                contentType = 'podcast';
              }

              return (
                <Link key={post.id || idx} href={`/posts/${post.id}`} className="group flex flex-col no-underline">
                  <article className="flex flex-col w-full text-left">
                    <div className="relative overflow-hidden bg-[#111] border border-white/5 shadow-2xl transition-all duration-1000 group-hover:border-[#D4AF37]/30 aspect-video rounded-[30px] mb-5">
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
                      <h2 className="text-xl md:text-3xl font-[900] italic leading-[1.1] tracking-tighter group-hover:text-[#D4AF37] transition-colors duration-500">
                        {post.title}
                      </h2>
                      <p className="text-sm md:text-base text-white/50 leading-relaxed line-clamp-2 font-light">
                        {(post.body_text || post.content || "").replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="group flex flex-col items-center gap-4 text-[#D4AF37] hover:text-white transition-colors duration-500"
              >
                <span className="text-xs font-black tracking-[0.5em] uppercase italic">More Stories</span>
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:border-white/50 transition-all duration-500">
                  <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform duration-500" />
                </div>
              </button>
            </div>
          )}
        </section>
      )}

      <ArchiveSection />
    </>
  );
}
