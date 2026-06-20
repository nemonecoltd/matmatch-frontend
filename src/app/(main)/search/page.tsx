import React from 'react';
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "검색",
  robots: { index: false, follow: true },
};

const getThumbnail = (post: any) => {
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

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || '').toLowerCase();

  let posts: any[] = [];
  try {
    const res = await fetch('http://127.0.0.1:8080/posts', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      posts = Array.isArray(data) ? data : (data.posts || []);
    }
  } catch (error) {
    console.error("Search Fetch Error:", error);
  }

  const results = query
    ? posts.filter(post =>
        post.title?.toLowerCase().includes(query) ||
        post.body_text?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.tags?.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#D4AF37] selection:text-black font-serif italic pb-32">
      <main className="max-w-5xl mx-auto px-6 md:px-8 py-5 md:py-10">
        <h1 className="text-[#D4AF37] text-xs font-black tracking-[0.4em] uppercase italic mb-12">
          &apos;{q}&apos; 검색결과 ({results.length})
        </h1>
        <div className="flex flex-col gap-12">
          {results.length > 0 ? (
            results.map(post => (
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
            ))
          ) : (
            <div className="text-center py-40 border border-white/5 rounded-[60px] bg-white/5">
              <p className="text-[#D4AF37] text-xl font-black italic tracking-widest uppercase opacity-30">No matches found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
