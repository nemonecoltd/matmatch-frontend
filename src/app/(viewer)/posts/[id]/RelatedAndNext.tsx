import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface RelatedPost {
  id: number;
  title: string;
  category?: string;
  body_text?: string;
  thumbnail_url?: string;
  image_url?: string;
}

const getThumbnail = (post: RelatedPost) => {
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.image_url) {
    if (post.image_url.startsWith('/thumbnails')) return `https://nemoneai.com${post.image_url}`;
    return post.image_url;
  }
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
};

// RELATED STORIES(같은 카테고리 3개) + NEXT STORY(다음 글 1개, 큼직하게) — 기존
// prev+next 통합 "Explore More" 박스를 대체(지시서 3-5, 3-6장). prev 이동은 이미 떠
// 있는 ArticleNavArrows 화살표가 계속 담당하므로 여기서는 next만 다룬다.
export default function RelatedAndNext({
  related,
  next,
}: {
  related: RelatedPost[];
  next: RelatedPost | null;
}) {
  // adjacent.next가 없는 마지막 글은 관련기사 중 하나로 폴백(DoD: 폴백 처리 필수)
  const nextStory = next ?? related[0] ?? null;
  const relatedCards = related.filter((p) => p.id !== nextStory?.id).slice(0, 3);

  if (relatedCards.length === 0 && !nextStory) return null;

  return (
    <div className="max-w-7xl mx-auto mb-16">
      {relatedCards.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[#D4AF37] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase italic">Related Stories</span>
            <div className="h-[1px] flex-grow bg-[#D4AF37]/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedCards.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group block no-underline">
                <div className="aspect-video rounded-2xl overflow-hidden bg-[#111] border border-white/5 mb-3">
                  <img
                    src={getThumbnail(post)}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase not-italic block mb-1.5">
                  {post.category || "Journal"}
                </span>
                <h3 className="text-base md:text-lg font-black italic leading-snug tracking-tight break-keep group-hover:text-[#D4AF37] transition-colors">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {nextStory && (
        <Link
          href={`/posts/${nextStory.id}`}
          className="group block w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 no-underline hover:border-[#D4AF37]/50 transition-all"
        >
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase not-italic block mb-4">Next Story</span>
          <span className="text-[9px] font-black tracking-widest uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded w-fit inline-block mb-4">
            {nextStory.category || "Journal"}
          </span>
          <h3 className="text-base md:text-lg font-bold italic leading-snug break-keep text-white/80 group-hover:text-white transition-colors mb-6">
            {nextStory.title}
          </h3>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-black uppercase tracking-widest not-italic">
            Read <ChevronRight size={16} />
          </div>
        </Link>
      )}
    </div>
  );
}
