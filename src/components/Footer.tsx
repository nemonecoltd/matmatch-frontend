"use client";

import Link from 'next/link';

const Footer = () => {
  const GOLD = "#D4AF37";
  const BLACK = "#0c0c0c";

  const footerLinks = [
    { name: '글로벌미식탐험대', href: 'https://www.youtube.com/@MatMatch' },
    { name: 'PODCAST', href: 'https://open.spotify.com/show/62nfTOr0QFm1o3FIRrcEc7?si=1c9d3582aa404257' },
    { name: 'ABOUT', href: 'https://home.nemoneai.com' }, // 공식 홈페이지 연결 
    { name: 'BLOG', href: 'https://brunch.co.kr/@you1' }, 
  ];

  return (
    <footer 
      className="w-full py-8 md:py-12 border-t border-white/5"
      style={{ background: BLACK, color: '#aaa', fontFamily: 'Georgia, serif' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        {/* 좌측: 저작권 및 브랜드 설명 */}
        <div className="flex-grow text-sm md:text-base">
          <p className="m-0">© NEMONE INC. ALL RIGHTS RESERVED.</p>
        </div>

        {/* 우측: 관련 링크 */}
        <nav className="flex gap-4 md:gap-8 text-xs md:text-sm font-bold uppercase tracking-wider">
          {footerLinks.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="no-underline text-white/50 hover:text-white transition-colors duration-200"
              target={item.href.startsWith('http') ? "_blank" : undefined}
              rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
