import Link from 'next/link';

const getThumbnail = (post: any) => {
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.image_url) {
    if (post.image_url.startsWith('/thumbnails')) return `https://nemoneai.com${post.image_url}`;
    return post.image_url;
  }
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
};

// 좌(2/3) LATEST STORIES + 우(1/3) WEEKLY RANKING 2단 컬럼. 조회수 기반 랭킹은
// 편집 섹션(TODAY/ORIGINALS/FOUR WORLDS)보다 반드시 아래(지시서 4-5장, 7장)
export default function LatestAndRanking({ latest, ranking }: { latest: any[]; ranking: any[] }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10 mb-16 md:mb-24">
      <div className="lg:col-span-2">
        <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase not-italic mb-6">
          Latest Stories
        </p>
        <div className="flex flex-col gap-8">
          {latest.map((post, idx) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group flex gap-6 items-center no-underline border-b border-white/5 pb-8 last:border-0 last:pb-0"
            >
              <span className="text-2xl md:text-3xl font-[900] italic text-white/15 flex-shrink-0 w-10">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="w-28 md:w-40 aspect-video rounded-2xl overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                <img
                  src={getThumbnail(post)}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase not-italic block mb-1.5">
                  {post.category || "Journal"}
                </span>
                <h3 className="text-base md:text-xl font-black italic leading-snug tracking-tight group-hover:text-[#D4AF37] transition-colors truncate">
                  {post.title}
                </h3>
                <p className="text-white/40 text-xs md:text-sm mt-1 line-clamp-1 font-light not-italic">
                  {(post.body_text || post.content || "").replace(/<[^>]*>?/gm, '')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase not-italic mb-6">
          Weekly Ranking
        </p>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
          <div className="flex flex-col gap-4">
            {ranking.map((item, index) => (
              <Link
                key={item.id}
                href={`/posts/${item.id}`}
                className="group flex items-center gap-4 no-underline border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-xl md:text-2xl font-[900] italic text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors flex-shrink-0">
                  0{index + 1}
                </span>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                  <img src={getThumbnail(item)} alt={item.title} className="w-full h-full object-cover opacity-80" />
                </div>
                <span className="text-sm font-bold italic text-white/80 group-hover:text-white transition-colors line-clamp-2">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
          {/* "전체 랭킹 보기" 링크는 지시서 4-5장에 명시돼 있으나, 공개용 전체 랭킹
              페이지가 아직 없음(백엔드는 /posts/ranking 상위 3건만 공개, top10은
              관리자 전용) — 죽은 링크를 걸지 않기 위해 페이지가 생기기 전까지 보류 */}
        </div>
      </div>
    </section>
  );
}
