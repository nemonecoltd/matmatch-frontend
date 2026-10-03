import Link from 'next/link';

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

// RELATED STORIES(같은 카테고리 3개) — 2026-10-03 매출개선 작업으로 NEXT STORY 박스는
// 삭제(prev/next 이동은 이미 떠 있는 ArticleNavArrows 좌우 고정 화살표가 계속 담당).
// 3번째 칸은 어드민이 수동 지정(override3, page.tsx에서 related3_url로 조회해 넘김)했으면
// 그걸 우선 쓰고, 없으면 기존처럼 related의 3번째 글을 자동으로 쓴다.
export default function RelatedAndNext({
  related,
  override3,
}: {
  related: RelatedPost[];
  override3?: RelatedPost | null;
}) {
  const autoCards = related.filter((p) => p.id !== override3?.id).slice(0, override3 ? 2 : 3);
  const relatedCards = override3 ? [...autoCards, override3] : autoCards;

  if (relatedCards.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto mb-16">
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
    </div>
  );
}
