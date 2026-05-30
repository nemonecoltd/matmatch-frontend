"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coffee, BookOpen, Heart, Laptop, Sparkles } from 'lucide-react';

interface BottomTabBarProps {
  activeCategory?: string; // 수동으로 활성화할 카테고리 (뷰어 페이지용)
}

const BottomTabBar = ({ activeCategory }: BottomTabBarProps) => {
  const pathname = usePathname();
  const GOLD = "#D4AF37";
  const BLACK = "#0c0c0c";

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Taste', href: '/category/Taste', icon: Coffee },
    { name: 'Culture', href: '/category/Culture', icon: BookOpen },
    { name: 'Life', href: '/category/Life', icon: Heart },
    { name: 'Tech', href: '/category/Tech', icon: Laptop },
    { name: 'Special', href: '/special', icon: Sparkles },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 w-full md:hidden z-[100] border-t border-white/10"
      style={{
        background: BLACK,
        padding: '0.75rem 0',
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))', // 아이폰 하단 바 대응
        boxShadow: '0 -4px 15px rgba(0,0,0,0.3)',
      }}
    >
      <nav className="flex justify-around items-center h-full">
        {menuItems.map((item) => {
          // 1. 경로 일치 여부 
          // 2. 주입된 카테고리 명칭 일치 여부 (대소문자 무관하게 비교)
          const isActive = pathname === item.href || (activeCategory?.toLowerCase() === item.name.toLowerCase());
          
          return (
            <Link href={item.href} key={item.name} className="flex flex-col items-center justify-center text-white/50 hover:text-[#D4AF37] transition-colors duration-200 no-underline" style={{ flex: 1 }}>
              <item.icon size={20} style={{ color: isActive ? GOLD : undefined }} />
              <span className="text-[10px] font-bold mt-1" style={{ color: isActive ? GOLD : undefined }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomTabBar;
