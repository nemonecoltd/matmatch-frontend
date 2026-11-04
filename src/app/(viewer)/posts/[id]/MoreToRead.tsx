import Link from 'next/link';
import type { InternalLinks } from '@/lib/internalLinks';

// 기사 하단 "함께 읽으면 좋은 글" — 글 제목을 그대로 앵커 텍스트로 쓰는 본문 링크(검색엔진이 주제 관계를 읽는다).
export default function MoreToRead({ links }: { links: InternalLinks }) {
  const { special, sameSpecial, sameTags } = links;
  if (!special && sameSpecial.length === 0 && sameTags.length === 0) return null;
  return (
    <nav aria-label="함께 읽으면 좋은 글" className="max-w-7xl mx-auto mb-16 not-italic">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-[#D4AF37] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase italic">함께 읽으면 좋은 글</h2>
        <div className="h-[1px] flex-grow bg-[#D4AF37]/20" />
      </div>
      {special && (
        <p className="mb-4 text-sm text-white/70">
          이 글이 들어 있는 모음{' '}
          <Link href={`/special/${special.id}`} className="text-[#D4AF37] underline underline-offset-4 decoration-[#D4AF37]/40 hover:decoration-[#D4AF37]">
            {special.title}
          </Link>
        </p>
      )}
      <ul className="space-y-2 text-[15px] leading-relaxed">
        {[...sameSpecial, ...sameTags].map((p) => (
          <li key={p.id}>
            <Link href={`/posts/${p.id}`} className="text-white/80 hover:text-[#D4AF37] underline underline-offset-4 decoration-white/20 hover:decoration-[#D4AF37]">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
