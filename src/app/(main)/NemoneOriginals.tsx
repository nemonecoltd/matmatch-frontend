import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const getThumbnail = (url: string) => {
  if (!url) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";
  if (url.startsWith('/thumbnails')) return `https://nemoneai.com${url}`;
  return url;
};

// /specials(created_at desc) 상위 3건을 그대로 받아 렌더 — 시리즈가 3개 미만이어도
// grid가 자연스럽게 줄어들 뿐 깨지지 않음(지시서 4-3장)
export default function NemoneOriginals({ specials }: { specials: any[] }) {
  if (!specials.length) return null;

  return (
    <section className="mb-16 md:mb-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase not-italic mb-3">
            Nemone Originals
          </p>
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tight mb-2">
            당신의 다음 3시간을 설계합니다
          </h2>
          <p className="text-white/40 text-sm font-light not-italic">
            바쁜 일상 속, 더 깊이 생각하고 더 나은 선택을 위한 네모네의 특별한 제안
          </p>
        </div>
        <Link
          href="/special"
          className="hidden md:block text-[#D4AF37] text-[10px] font-black tracking-widest uppercase no-underline hover:text-white transition-colors flex-shrink-0"
        >
          SERIES 전체보기 →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {specials.map((special) => (
          <Link key={special.id} href={`/special/${special.id}`} className="group block no-underline">
            <div className="relative aspect-[4/3] rounded-[30px] overflow-hidden bg-[#111] border border-white/5 mb-4">
              <img
                src={getThumbnail(special.bg_image_url)}
                alt={special.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[9px] font-black tracking-widest uppercase not-italic">Series</span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-black italic leading-snug tracking-tight group-hover:text-[#D4AF37] transition-colors">
              {special.title}
            </h3>
            <p className="text-white/40 text-xs mt-1 line-clamp-1 font-light not-italic">{special.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
