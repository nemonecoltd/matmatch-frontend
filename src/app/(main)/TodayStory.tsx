import Link from 'next/link';
import { Play, Zap, Mic, FileText } from 'lucide-react';
import AdSlot from '@/components/AdSlot';

const getThumbnail = (post: any) => {
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.image_url) {
    if (post.image_url.startsWith('/thumbnails')) return `https://nemoneai.com${post.image_url}`;
    return post.image_url;
  }
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
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

  return (
    <section className="mb-16 md:mb-24">
      <Link href={`/posts/${post.id}`} className="group block no-underline">
        <article className="flex flex-col w-full text-left">
          <div className="relative overflow-hidden bg-[#111] border border-white/5 shadow-2xl transition-all duration-1000 group-hover:border-[#D4AF37]/30 aspect-[21/9] rounded-[40px] max-h-[220px] sm:max-h-[320px] lg:max-h-[420px] mb-6">
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
            {/* 클릭 불가능한 정적 배지 — 실제 영상은 상세 페이지 내부에 임베드(지시서 4-2장) */}
            {hasVideo && (
              <span className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-black tracking-widest uppercase not-italic text-white">
                <Play size={10} fill="white" /> Watch Video
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 px-2">
            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase not-italic">
              Today&apos;s Story
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[#D4AF37] text-xs font-black tracking-[0.3em] uppercase not-italic">
                {post.category || "Journal"}
              </span>
            </div>
            <h2 className="text-[clamp(1.5rem,4vw+0.5rem,4rem)] font-[900] italic leading-[1.1] tracking-tighter group-hover:text-[#D4AF37] transition-colors duration-500">
              {post.title}
            </h2>
            <p className="text-base md:text-xl max-w-4xl text-white/50 leading-relaxed line-clamp-2 font-light">
              {(post.body_text || post.content || "").replace(/<[^>]*>?/gm, '')}
            </p>
          </div>
        </article>
      </Link>

      <div className="mt-10">
        <AdSlot adSlot="7051929128" />
      </div>
    </section>
  );
}
