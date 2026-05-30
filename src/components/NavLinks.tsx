"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  activeCategory?: string; // 수동으로 활성화할 카테고리 (뷰어 페이지용)
}

const NavLinks = ({ activeCategory }: NavLinksProps) => {
  const pathname = usePathname();
  const categories = ['Taste', 'Culture', 'Life', 'Tech', 'SPECIAL'];

  return (
    <nav className="hidden lg:flex gap-12">
      {categories.map((item) => {
        const href = item === 'SPECIAL' ? '/special' : `/category/${item}`;
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
            {item}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
