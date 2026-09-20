"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  activeCategory?: string; // 수동으로 활성화할 카테고리 (뷰어 페이지용)
}

const NavLinks = ({ activeCategory }: NavLinksProps) => {
  const pathname = usePathname();
  // BOOKS(유료 전자책)는 ORIGIN(무료 편집 자산)과 성격이 달라 합치지 않고 별도 메뉴로 둔다(지시서 6-1장)
  const categories = ['Taste', 'Culture', 'Life', 'Tech', 'SPECIAL', 'BOOKS'];
  // 메뉴 표시 문구만 SPECIAL -> ORIGIN으로 변경(2026-09-05) — 라우트(/special)와
  // activeCategory="SPECIAL" 식별자는 다른 페이지들과 그대로 맞춰야 해서 안 바꿈
  const LABEL: Record<string, string> = { SPECIAL: 'ORIGIN' };

  return (
    <nav className="hidden lg:flex gap-12">
      {categories.map((item) => {
        const href =
          item === 'SPECIAL' ? '/special' : item === 'BOOKS' ? '/books' : `/category/${item}`;
        // 1. 현재 경로가 카테고리 페이지인 경우 (pathname 비교)
        // 2. 현재 페이지가 포스트 상세 페이지인 경우 (주입된 activeCategory 비교)
        const isActive = pathname === href || activeCategory === item;

        return (
          <Link
            key={item}
            href={href}
            className={`text-[11px] font-[900] uppercase tracking-[0.3em] transition-all duration-300 no-underline ${
              isActive
                ? 'text-[#D4AF37] opacity-100'
                : 'text-white opacity-40 hover:opacity-100 hover:text-[#D4AF37]'
            }`}
          >
            {LABEL[item] ?? item}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
