import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdjacentPost {
  id: number;
  title: string;
  category?: string;
}

export default function ArticleNavArrows({ prev, next }: { prev: AdjacentPost | null; next: AdjacentPost | null }) {
  if (!prev && !next) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 z-40 pointer-events-none">
      {prev && (
        <Link
          href={`/posts/${prev.id}`}
          aria-label={`이전 글: ${prev.title}`}
          title={prev.title}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] not-italic hover:bg-black/90 hover:border-[#D4AF37] active:scale-95 transition-all"
        >
          <ChevronLeft size={22} />
        </Link>
      )}
      {next && (
        <Link
          href={`/posts/${next.id}`}
          aria-label={`다음 글: ${next.title}`}
          title={next.title}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] not-italic hover:bg-black/90 hover:border-[#D4AF37] active:scale-95 transition-all"
        >
          <ChevronRight size={22} />
        </Link>
      )}
    </div>
  );
}
