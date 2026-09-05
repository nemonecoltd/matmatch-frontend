import Link from 'next/link';
import { Play, Mic } from 'lucide-react';

const getThumbnail = (post: any) => {
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.image_url) {
    if (post.image_url.startsWith('/thumbnails')) return `https://nemoneai.com${post.image_url}`;
    return post.image_url;
  }
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
};

const CONTENT_TYPE_LABEL: Record<string, string> = {
  blog: 'ESSAY',
  podcast: 'PODCAST',
  youtube: 'VIDEO',
  shorts: 'SHORTS',
};

// 오늘의 글을 고르는 "고정" 플래그는 아직 없음 — 지시서 6장이 허용한 대로
// 최신 글(posts[0])로 폴백. 나중에 어드민에서 수동 고정이 필요해지면 그때 컬럼 추가.
export default function TodayStory({ post }: { post: any }) {
  const vUrl = post.video_url || post.youtube_url || "";
  let contentType = 'blog';
  if (vUrl.includes('youtube.com') || vUrl.includes('youtu.be')) {
    contentType = vUrl.includes('/shorts/') ? 'shorts' : 'youtube';
  } else if (vUrl.includes('spotify.com')) {
    contentType = 'podcast';
  }
  const hasVideo = contentType === 'youtube' || contentType === 'shorts';
  const hasAudio = contentType === 'podcast';

  // 실제 예상 읽기시간 필드는 없어 본문 길이로 대략 추정(신규 컬럼 추가 없이 폴백)
  const bodyText = (post.body_text || post.content || "").replace(/<[^>]*>?/gm, '');
  const minutes = Math.max(3, Math.round(bodyText.length / 400));

  return (
    <section className="mb-8 md:mb-12">
      {/* 시안(개편이미지.png)처럼 텍스트를 이미지 안쪽에 오버레이 — special/[id]/page.tsx
          히어로와 동일한 패턴(전면 이미지 + 그라데이션 + absolute 텍스트) */}
      <Link
        href={`/posts/${post.id}`}
        className="group relative flex items-end overflow-hidden bg-[#111] border border-white/5 shadow-2xl rounded-[40px] min-h-[460px] md:min-h-[560px] no-underline"
      >
        <img
          src={getThumbnail(post)}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[1500ms]"
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/10 to-transparent" />

        {/* 좌상단에 크고 굵게 고정 배치 — 기존엔 하단 텍스트 블록 안에 작게 섞여 있어
            눈에 잘 안 띄었음(2026-09-05 사용자 피드백) */}
        <span className="absolute top-6 left-6 md:top-8 md:left-8 z-10 text-[#D4AF37] text-sm md:text-base font-black tracking-[0.3em] uppercase not-italic">
          Today&apos;s Story
        </span>

        {/* 우하단 미디어 배지 — 영상/오디오 둘 다 같은 자리에서 타입만 바뀜
            (2026-09-06 사용자 요청: 팟캐스트에도 유튜브와 동일한 표기 필요) */}
        {(hasVideo || hasAudio) && (
          <span className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-3 py-1.5 text-[10px] font-black tracking-widest uppercase not-italic text-white z-10">
            <span className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
              {hasVideo ? (
                <Play size={9} fill="black" className="text-black ml-px" />
              ) : (
                <Mic size={10} className="text-black" />
              )}
            </span>
            {hasVideo ? 'Watch Video' : 'Listen Audio'}
          </span>
        )}

        <div className="relative z-10 flex flex-col gap-3 md:gap-4 px-6 py-8 md:px-14 md:py-12 max-w-2xl">
          <span className="text-[#D4AF37] text-xs font-black tracking-[0.3em] uppercase not-italic">
            {post.category || "Journal"}
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-[900] italic leading-[1.15] tracking-tighter break-keep text-white group-hover:text-[#D4AF37] transition-colors duration-500">
            {post.title}
          </h2>
          <p className="text-sm md:text-base text-white/60 leading-relaxed line-clamp-2 font-light">
            {bodyText}
          </p>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-black tracking-[0.2em] uppercase not-italic mt-1">
            {minutes} MIN READ · {CONTENT_TYPE_LABEL[contentType]}
          </div>
        </div>
      </Link>
    </section>
  );
}
