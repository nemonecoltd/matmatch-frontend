import Link from 'next/link';
import { ChefHat, Landmark, Home, Cpu } from 'lucide-react';

// 완전 정적 섹션 — fetch 없음. 카피는 지시서 4-4장 원문 그대로.
const WORLDS = [
  { key: 'Taste', label: 'TASTE', icon: ChefHat, desc: '우리가 먹는 것의 역사와 철학' },
  { key: 'Culture', label: 'CULTURE', icon: Landmark, desc: '사람들이 만들어온 다양한 삶의 방식' },
  { key: 'Life', label: 'LIFE', icon: Home, desc: '우리가 살아가는 공간과 일상' },
  { key: 'Tech', label: 'TECH', icon: Cpu, desc: '기술이 바꾸는 우리의 미래' },
] as const;

export default function FourWorlds() {
  return (
    <section className="relative rounded-[40px] overflow-hidden border border-white/5 mb-8 md:mb-12">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/60 via-[#0c0c0c]/70 to-[#0c0c0c]/90" />

      <div className="relative z-10 px-8 py-7 md:px-14 md:py-10">
        <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase not-italic mb-3">
          Four Ways To See The World
        </p>
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tight mb-5 max-w-2xl">
          네모네는 세상을 네 가지 렌즈로 바라봅니다
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {WORLDS.map(({ key, label, icon: Icon, desc }) => (
            <div key={key} className="flex flex-col gap-3 not-italic">
              <Icon size={22} className="text-[#D4AF37]" strokeWidth={1.5} />
              <span className="text-sm font-black tracking-widest">{label}</span>
              <p className="text-white/50 text-xs leading-relaxed font-light italic min-h-[2.5rem]">{desc}</p>
              <Link
                href={`/category/${key}`}
                className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase no-underline hover:text-white transition-colors w-fit"
              >
                더 알아보기 →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
