import { Youtube, Mic, Rss, ShoppingBag } from 'lucide-react';

// 전역 Footer.tsx(텍스트 링크바)와는 별개인 홈페이지 전용 카드형 섹션 — 링크는
// Footer.tsx와 동일한 값을 재사용(지시서 4-6장). 네모네플랜트 -> 네이버블로그로
// 교체(2026-09-05, 사용자 요청)
const ARCHIVE_LINKS = [
  { label: 'YouTube', desc: '영상으로 보는 깊이 있는 시선', href: 'https://www.youtube.com/@nemoneaim', icon: Youtube },
  { label: 'Podcast', desc: '귀로 듣는 네모네의 인사이트', href: 'https://podcasts.apple.com/kr/channel/%EB%84%A4%EB%AA%A8%EB%84%A4aim/id6753140870', icon: Mic },
  { label: '네이버블로그', desc: '글로 읽는 네모네의 기록', href: 'https://blog.naver.com/nemoneaim', icon: Rss },
  { label: '네모네스토어', desc: '감각적인 라이프스타일 상품', href: 'https://smartstore.naver.com/nemone24', icon: ShoppingBag },
] as const;

export default function ArchiveSection() {
  return (
    <section className="border-t border-white/5 pt-12 mb-4">
      <p className="text-white/40 text-xs font-bold not-italic mb-6">
        네모네AIM과 함께하는 더 많은 이야기
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ARCHIVE_LINKS.map(({ label, desc, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 p-5 rounded-2xl bg-white/[.03] border border-white/5 no-underline hover:border-[#D4AF37]/30 hover:bg-white/[.06] transition-all"
          >
            <Icon size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
            <div>
              <span className="text-sm font-black not-italic block">{label}</span>
              <span className="text-white/40 text-[11px] font-light not-italic">{desc}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
