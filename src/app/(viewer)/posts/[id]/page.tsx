import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PostActions from './PostActions';
import CommentsSection from './CommentsSection';
import ViewAdSlot from './ViewAdSlot';
import InArticleAd from './InArticleAd';
import ProductRecommendation, { pickProduct, type AffiliateProduct } from './ProductRecommendation';
import ArticleNavArrows from './ArticleNavArrows';
import MediaUnit from './MediaUnit';
import RelatedAndNext from './RelatedAndNext';
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

// 부제(subtitle) 필드가 DB/어드민에 없음 — 실제 제목 다수가 이미 "대제목: 부제" 형태라
// 콜론 기준으로만 분리(기사페이지개편_지시서 3-1장). 콜론 없으면 원래 제목 그대로.
const splitTitle = (title: string): { main: string; subtitle: string | null } => {
  const idx = title.indexOf(':');
  if (idx === -1) return { main: title, subtitle: null };
  return { main: title.slice(0, idx).trim(), subtitle: title.slice(idx + 1).trim() };
};

// 소제목은 이미 관리자가 "1. 제목" 형태로 본문에 직접 써넣는 관례라(실제 글로 확인됨),
// 별도 필드 없이 정규식으로 넘버만 큼직하게 분리해 2단 레이아웃으로 승격(지시서 3-3장).
const SECTION_HEADING_HTML = (num: string, title: string) =>
  `<div class="section-heading"><span class="section-num">${String(num).padStart(2, '0')}</span><span class="section-title">${title.trim()}</span></div>`;

const promoteSectionHeadings = (bodyHtml: string): string =>
  bodyHtml
    // 실제 <h1~3> 태그로 쓴 글(예: id 219)
    .replace(
      /<h([1-3])>\s*(\d+)\.\s*([^<]*)<\/h\1>/g,
      (_match, _level, num, title) => SECTION_HEADING_HTML(num, title)
    )
    // Quill이 굵은 글씨 문단으로만 쓴 글(예: id 217) — 관리자마다 작성 방식이 달라
    // 실제 두 가지 패턴이 섞여 있음(2026-09-05 확인)
    .replace(
      /<p>\s*<strong>\s*(\d+)\.\s*([^<]*)<\/strong>\s*<\/p>/g,
      (_match, num, title) => SECTION_HEADING_HTML(num, title)
    );

// 본문 이미지가 나중에(예: 다른 서비스 스토리지 정리로) 깨지면 부서진 아이콘이
// 그대로 노출되던 문제(2026-09-05 사용자 리포트, id 218 확인) — 어떤 이유로든
// 로드 실패 시 그 이미지만 조용히 숨김. 원인 자체(외부 스토리지 URL을 직접 박아
// 넣는 관행)는 어드민 콘텐츠 작성 습관 문제라 여기서 고칠 수 없어 방어만 추가.
const guardBrokenImages = (bodyHtml: string): string =>
  bodyHtml.replace(/<img /g, `<img onerror="this.style.display='none'" `);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`http://127.0.0.1:8080/posts/${id}`);
    if (!res.ok) {
      return {
        title: `삭제된 게시물 #${id} | 네모네AIM`,
        robots: { index: false, follow: false },
        alternates: { canonical: `https://nemoneai.com/posts/${id}` },
      };
    }
    const post = await res.json();
    const data = Array.isArray(post) ? post[0] : post;
    if (!data?.id) {
      return {
        title: `삭제된 게시물 #${id} | 네모네AIM`,
        robots: { index: false, follow: false },
        alternates: { canonical: `https://nemoneai.com/posts/${id}` },
      };
    }

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

// 하이브리드 SSG: 최신 100개만 빌드 시점에 정적 생성, 나머지는 dynamicParams(기본값 true)로
// 첫 방문 때 on-demand 렌더링 후 revalidate(1시간) 주기로 캐시 — 글이 계속 늘어도 빌드 시간이
// 늘어나지 않고, 색인 대상에서 빠지는 것도 아님(모든 id가 여전히 접근/크롤링 가능).
export async function generateStaticParams() {
  try {
    const res = await fetch('http://127.0.0.1:8080/posts?limit=100', { cache: 'no-store' });
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
    if (res.ok) {
      const json = await res.json();
      data = Array.isArray(json) ? json[0] : json;
    }

    const adjRes = await fetch(`http://127.0.0.1:8080/posts/${id}/adjacent`, { next: { revalidate: 3600 } });
    adjacent = await adjRes.json();
  } catch (e) { console.error(e); }

  if (!data || !data.id) notFound();

  // RELATED STORIES — 같은 카테고리 글(카테고리 페이지가 이미 쓰는 패턴 재사용,
  // 신규 API 불필요). 넉넉히 4개 받아 현재 글 제외 후 앞에서 3개만 씀(지시서 3-5장)
  let relatedPosts: any[] = [];
  try {
    const relRes = await fetch(
      `http://127.0.0.1:8080/posts?category=${encodeURIComponent(data.category || '')}&limit=6`,
      { next: { revalidate: 3600 } }
    );
    if (relRes.ok) {
      const relJson = await relRes.json();
      const list = Array.isArray(relJson) ? relJson : (relJson.posts || []);
      relatedPosts = list.filter((p: any) => p.id !== data.id);
    }
  } catch (e) { /* 관련기사는 부가 기능 — 실패해도 기사 렌더링에 영향 없게 조용히 무시 */ }

  // 관리자가 직접 고른 상품이 있으면 우선, 없으면 태그로 자동매칭(전체 상품 목록은
  // 자주 안 바뀌므로 1시간 캐시 — 게시글 fetch와 동일한 revalidate 주기)
  let recommendedProduct: AffiliateProduct | null = null;
  try {
    const prodRes = await fetch('http://127.0.0.1:8080/affiliate-products', { next: { revalidate: 3600 } });
    const prodJson = await prodRes.json();
    const products: AffiliateProduct[] = Array.isArray(prodJson.items) ? prodJson.items : [];
    recommendedProduct = pickProduct(products, data.affiliate_product_id ?? null, data.tags ?? null);
  } catch (e) { /* 상품 추천은 부가 기능 — 실패해도 기사 렌더링에 영향 없게 조용히 무시 */ }

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

      {/* 같은 섹션(카테고리) 기사로 순서대로 이동하는 좌우 화살표 */}
      <ArticleNavArrows prev={adjacent?.prev ?? null} next={adjacent?.next ?? null} />

      {/* [단 1] Article Section: 히어로 + LISTEN/WATCH + 본문 */}
      <section className="relative pt-16 md:pt-32 pb-20 flex-grow">
        {/* 히어로는 여기서 완전히 끝난다 — 고정 660px(스펙 620~700px) 이후로는
            이미지가 아예 없는 순수 검정 배경(기사페이지개편_지시서 3-1장 핵심 변경점) */}
        {bgImage && (
          <div className="absolute top-0 left-0 w-full h-[660px] z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-cover bg-center md:bg-fixed opacity-60" style={{ backgroundImage: `url(${bgImage})` }} />
            {/* 하단으로 갈수록 블랙과 섞이는 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0c0c0c] backdrop-blur-[2px]" />
          </div>
        )}

        <article className="relative z-20 max-w-7xl w-full mx-auto px-6 mt-10">
          <header className="mb-12 text-left">
            <div className="text-[#D4AF37] text-xs font-black tracking-[0.35em] uppercase mb-4 not-italic border-l-4 border-[#D4AF37] pl-5">
              {data.category || "네모네AIM Archive"}
            </div>

            {/* 제목 10~15% 축소 + 콜론 있으면 대제목/부제 분리(지시서 3-1장) */}
            {(() => {
              const { main, subtitle } = splitTitle(data.title);
              return (
                <h1 className="text-[clamp(1.75rem,3.6vw+1rem,3.9rem)] font-[900] italic leading-[1.15] break-keep mb-8 tracking-tighter">
                  {main}
                  {subtitle && (
                    <span className="block text-[clamp(1.1rem,1.6vw+0.6rem,1.75rem)] text-white/60 font-medium not-italic mt-3 tracking-normal leading-snug">
                      {subtitle}
                    </span>
                  )}
                </h1>
              );
            })()}

            {/* 바이라인: 아바타 이니셜 + 필명 · 날짜 */}
            <div className="flex items-center gap-3 py-5 border-y border-white/10 not-italic">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs font-bold flex-shrink-0">
                {(data.author || '애들빙자여행러').charAt(0)}
              </div>
              <span className="text-sm text-white/50 font-medium tracking-wide">
                {data.author || '애들빙자여행러'} · {new Date(data.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </header>

          {/* READ·LISTEN·WATCH 유닛 — 히어로 밖(검정 배경)으로 승격(지시서 3-2장) */}
          <MediaUnit videoId={videoId} spotifyUrl={spotifyUrl} applePodcastUrl={applePodcastUrl} />

          {/* 본문 및 Drop Cap 스타일 보존 (이탤릭 제거로 가독성 강화) */}
          <div className="text-gray-200 leading-[2] text-lg max-w-[720px] mx-auto mb-12 prose-custom font-light tracking-[-0.01em] not-italic">
            {(() => {
              if (!data.body_text) return null;
              const bodyHtml = guardBrokenImages(promoteSectionHeadings(data.body_text));
              const paragraphs = bodyHtml.split('</p>');
              const mid = Math.floor(paragraphs.length / 2);
              if (paragraphs.length < 5) {
                return <div dangerouslySetInnerHTML={{ __html: data.body_text }} />;
              }
              const firstHalf = paragraphs.slice(0, mid).join('</p>') + '</p>';
              const secondHalf = paragraphs.slice(mid).join('</p>');
              return (
                <>
                  <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
                  <InArticleAd />
                  <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
                </>
              );
            })()}
          </div>

          {recommendedProduct && <ProductRecommendation product={recommendedProduct} />}

          {/* RELATED STORIES + NEXT STORY — prev 이동은 ArticleNavArrows(좌우 고정
              화살표)가 계속 담당하므로 여기서는 관련기사/다음글만(지시서 3-5, 3-6장) */}
          <RelatedAndNext related={relatedPosts} next={adjacent?.next ?? null} />

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
