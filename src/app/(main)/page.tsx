import React from 'react';
import { Metadata } from "next";
import HomeContent from './HomeContent';

export const revalidate = 60;

// [SEO] 메인 전용 메타데이터 (대표님 확정안 보존)
export const metadata: Metadata = {
  title: "네모네AIM - 당신 시간의 알찬 소비, 당신 주변의 변화를 관찰합니다",
  description: "당신 시간의 알찬 소비, 네모네AIM - 사람·미식·문화·라이프·테크를 통해 당신 주변의 변화를 관찰합니다.",
  alternates: { canonical: "https://nemoneai.com" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "네모네AIM - 당신 시간의 알찬 소비, 당신 주변의 변화를 관찰합니다",
    description: "당신 시간의 알찬 소비, 네모네AIM - 사람·미식·문화·라이프·테크를 통해 당신 주변의 변화를 관찰합니다.",
    url: "https://nemoneai.com",
    siteName: "네모네AIM",
    images: [{ url: "https://nemoneai.com/banner_store.png", width: 1200, height: 630, alt: "네모네AIM" }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "네모네AIM - 당신 시간의 알찬 소비, 당신 주변의 변화를 관찰합니다",
    description: "당신 시간의 알찬 소비, 네모네AIM - 사람·미식·문화·라이프·테크를 통해 당신 주변의 변화를 관찰합니다.",
    images: ["https://nemoneai.com/banner_store.png"],
  },
};

export default async function HomePage() {
  let posts: any[] = [];
  let rankingData: any[] = [];
  let mainSpecial: any = null;
  try {
    const [resPosts, resRanking, resSpecial] = await Promise.all([
      fetch('http://127.0.0.1:8080/posts', { next: { revalidate: 60 } }),
      fetch('http://127.0.0.1:8080/posts/ranking', { next: { revalidate: 60 } }),
      fetch('http://127.0.0.1:8080/specials/main', { next: { revalidate: 60 } })
    ]);
    
    if (resPosts.ok) {
      const data = await resPosts.json();
      posts = Array.isArray(data) ? data : (data.posts || []);
    }
    
    if (resRanking.ok) {
      const rData = await resRanking.json();
      rankingData = Array.isArray(rData) ? rData : (rData.posts || []);
    }

    if (resSpecial.ok) {
      mainSpecial = await resSpecial.json();
    }
  } catch (error) { 
    console.error("Main Fetch Error:", error); 
  }

  if (!posts.length) return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-[#D4AF37] font-serif italic text-2xl">네모네AIM.</div>;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#D4AF37] selection:text-black font-serif italic pb-32">
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-2.5 md:py-5">
        <HomeContent initialPosts={posts} rankingData={rankingData} mainSpecial={mainSpecial} />
      </main>
    </div>
  );
}
