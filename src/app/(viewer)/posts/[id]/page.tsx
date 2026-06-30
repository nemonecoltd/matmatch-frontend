import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PostActions from './PostActions';
import CommentsSection from './CommentsSection';
import ViewAdSlot from './ViewAdSlot'; // 하단 광고
import AdSlot from '@/components/AdSlot'; // 공용 광고 컴포넌트
import NavLinks from '@/components/NavLinks';
import BottomTabBar from '@/components/BottomTabBar';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import Header from '@/components/Header';

// [수정] SEO 및 로딩 속도 최적화를 위해 SSG(ISR) 방식으로 복구 (1시간 주기 갱신)
export const revalidate = 3600;

// [보존] 원본 Spotify 로직 100% 유지
const getSpotifyEmbedUrl = (url: string | null) => {
  if (!url) return null;
  const match = url.match(/(episode|track|show|playlist)\/([a-zA-Z0-9]+)/);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
  }
  return null;
};

const getApplePodcastEmbedUrl = (url: string | null) => {
  if (!url || !url.includes('podcasts.apple.com')) return null;
  return url.replace('https://podcasts.apple.com', 'https://embed.podcasts.apple.com')
            .replace('https://embed.embed.podcasts.apple.com', 'https://embed.podcasts.apple.com');
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`http://127.0.0.1:8080/posts/${id}`);
    const post = await res.json();
    const data = Array.isArray(post) ? post[0] : post;

    const imageUrl = data?.image_url || `https://nemoneai.com/api/og-image?title=${encodeURIComponent(data?.title || '네모네AIM.')}`; // OG 이미지 URL
    const pageTitle = data?.title || "네모네AIM";
    const pageDescription = (data?.body_text || "")
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ').trim().substring(0, 150) || "네모네AIM, 당신의 시간을 알차게 채워줄 프리미엄 콘텐츠.";

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: data?.tags,
      alternates: {
        canonical: `https://nemoneai.com/posts/${id}`,
      },
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `https://nemoneai.com/posts/${id}`,
        siteName: '네모네AIM',
        images: [{
          url: imageUrl,
          width: 1200, // OG 이미지 권장 너비
          height: 630, // OG 이미지 권장 높이
          alt: pageTitle,
        }],
        locale: 'ko_KR',
        type: 'article', // 게시물 유형
        publishedTime: data?.created_at, // 발행 시간
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [imageUrl],
      },
    };
  } catch (e) {
    console.error("Failed to generate metadata:", e);
    return {
      title: `포스트 #${(await params).id} | 네모네AIM`,
      description: "네모네가 만드는 고품격 라이프스타일 매거진. 미식, 문화, 라이프, 테크 콘텐츠.",
      alternates: { canonical: `https://nemoneai.com/posts/${(await params).id}` },
    };
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch('http://127.0.0.1:8080/posts?limit=10000', { cache: 'no-store' });
    const data = await res.json();
    const posts = Array.isArray(data) ? data : (data.posts || []);
    return posts.map((post: any) => ({ id: post.id.toString() }));
  } catch (e) { return []; }
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: any = null;
  let adjacent: any = null;
  try {
    const res = await fetch(`http://127.0.0.1:8080/posts/${id}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    data = Array.isArray(json) ? json[0] : json;

    const adjRes = await fetch(`http://127.0.0.1:8080/posts/${id}/adjacent`, { next: { revalidate: 3600 } });
    adjacent = await adjRes.json();
  } catch (e) { console.error(e); }

  if (!data) notFound();

  const getVid = (u: string) => {
    if(!u || u.includes('spotify.com') || u.includes('open.spotify')) return null;
    const match = u.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]{11})/);
    return match ? match[1] : null; 
  };

  const videoId = getVid(data.youtube_url || data.video_url);
  const spotifyUrl = getSpotifyEmbedUrl(data.video_url || data.youtube_url);
  const applePodcastUrl = getApplePodcastEmbedUrl(data.video_url || data.youtube_url);
  
  // [수정] 클로드 명령 1순위: API 필드명 4중 방어막 구축
  const bgImage = data.thumbnail_url 
      || data.thumbnail 
      || data.image_url
      || data.cover_image
      || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');

  return (
    <div className="bg-[#0c0c0c] text-white selection:bg-[#D4AF37] selection:text-black font-serif italic overflow-x-hidden min-h-screen flex flex-col">
      <AnalyticsTracker postId={id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://nemoneai.com/posts/${id}` },
        "headline": data.title,
        ...(bgImage ? { "image": [bgImage] } : {}),
        "datePublished": data.created_at,
        "dateModified": data.updated_at || data.created_at,
        "author": { "@type": "Person", "name": "애들빙자여행러" },
        "publisher": {
          "@type": "Organization",
          "name": "네모네AIM",
          "logo": { "@type": "ImageObject", "url": "https://nemoneai.com/matmatch_icon_512.svg" }
        },
        "description": (data.body_text || "").replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim().substring(0, 150)
      })}} />
      
      {/* 헤더: 네모네AIM 디자인 원형 엄수 (900 두께, -0.07em 자간) */}
      <Header />

      {/* [단 1] Article Section: 헤더 + 미디어 + 본문 */}
      <section className="relative pt-32 pb-20 flex-grow">
        {bgImage && (
          <div className="absolute top-0 left-0 w-full h-[75vh] z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60" style={{ backgroundImage: `url(${bgImage})` }} />
            {/* 하단으로 갈수록 블랙과 섞이는 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0c0c0c] backdrop-blur-[2px]" />
          </div>
        )}
        
        <article className="relative z-20 max-w-7xl w-full mx-auto px-6 mt-10">
          <header className="mb-12 text-left">
            <div className="text-[#D4AF37] text-xs font-black tracking-[0.35em] uppercase mb-4 not-italic border-l-4 border-[#D4AF37] pl-5">
              {data.category || "네모네AIM Archive"}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] italic leading-[1.1] break-keep mb-8 tracking-tighter">
              {data.title}
            </h1>

            {/* 바이라인: 아바타 이니셜 + 필명 · 날짜 */}
            <div className="flex items-center gap-3 py-5 border-y border-white/10 not-italic">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs font-bold flex-shrink-0">
                {(data.author || '애들빙자여행러').charAt(0)}
              </div>
              <span className="text-sm text-white/50 font-medium tracking-wide">
                {data.author || '애들빙자여행러'} · {new Date(data.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            {videoId && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-20 bg-black">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} allowFullScreen />
              </div>
            )}

            {spotifyUrl && (
              <div className="w-full my-20 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <iframe src={spotifyUrl} width="100%" height="232" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
              </div>
            )}

            {applePodcastUrl && (
              <div className="w-full my-20 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameBorder="0" height="175" style={{width:'100%', maxWidth:'100%', overflow:'hidden', borderRadius:'10px'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src={applePodcastUrl} />
              </div>
            )}
          </header>

          {/* 본문 및 Drop Cap 스타일 보존 (이탤릭 제거로 가독성 강화) */}
          <div className="text-gray-200 leading-[1.9] text-lg md:text-xl max-w-[720px] mx-auto mb-12 prose-custom font-light tracking-[-0.01em] not-italic">
            {(() => {
              if (!data.body_text) return null;
              const paragraphs = data.body_text.split('</p>');
              const mid = Math.floor(paragraphs.length / 2);
              if (paragraphs.length < 5) {
                return <div dangerouslySetInnerHTML={{ __html: data.body_text }} />;
              }
              const firstHalf = paragraphs.slice(0, mid).join('</p>') + '</p>';
              const secondHalf = paragraphs.slice(mid).join('</p>');
              return (
                <>
                  <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
                  <AdSlot adSlot="6725352413" className="my-10" />
                  <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
                </>
              );
            })()}
          </div>

          {adjacent && (adjacent.prev || adjacent.next) && (
            <div className="max-w-7xl mx-auto mb-10">
              <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#D4AF37] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase italic">Explore More</span>
                  <div className="h-[1px] flex-grow bg-[#D4AF37]/20"></div>
                </div>
                <div className="flex flex-col gap-4">
                  {adjacent.next && (
                    <Link href={`/posts/${adjacent.next.id}`} className="group flex items-center gap-6 no-underline border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="text-xl md:text-2xl font-[900] italic text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors w-16">NEXT</span>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-grow overflow-hidden">
                        <span className="text-[9px] font-black tracking-widest uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded w-fit flex-shrink-0">{adjacent.next.category}</span>
                        <span className="text-base md:text-lg font-bold italic text-white/80 group-hover:text-white transition-colors truncate">
                          {adjacent.next.title}
                        </span>
                      </div>
                    </Link>
                  )}
                  {adjacent.prev && (
                    <Link href={`/posts/${adjacent.prev.id}`} className="group flex items-center gap-6 no-underline border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="text-xl md:text-2xl font-[900] italic text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors w-16">PREV</span>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-grow overflow-hidden">
                        <span className="text-[9px] font-black tracking-widest uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded w-fit flex-shrink-0">{adjacent.prev.category}</span>
                        <span className="text-base md:text-lg font-bold italic text-white/80 group-hover:text-white transition-colors truncate">
                          {adjacent.prev.title}
                        </span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-20 max-w-7xl mx-auto">
            {data.tags?.split(',').map((tag: string) => (
              <span key={tag} className="px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-[11px] font-black uppercase tracking-wider italic hover:bg-[#D4AF37]/20 transition-all cursor-pointer select-none">
                # {tag.trim()}
              </span>
            ))}
          </div>

          <div className="max-w-7xl mx-auto">
            <PostActions />
          </div>

          {/* 댓글 섹션 추가 */}
          <CommentsSection postId={id} />
        </article>
      </section>

      {/* [단 2] Main Ad Section: 광고 전용 구역 */}
      <section className="relative z-30 bg-[#0c0c0c] border-y border-white/5">
        <ViewAdSlot />
      </section>

      {/* 모바일 전용 하단 탭바: 카테고리 활성화 포함 */}
      <BottomTabBar activeCategory={data.category} />

      {/* [단 3] Footer Section: 푸터 정보 (공통 Footer 컴포넌트가 대신 표시됨) */}
    </div>
  );
}
