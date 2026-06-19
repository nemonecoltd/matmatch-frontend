"use client";

import Link from 'next/link';

const footerLinks = [
  { name: '글로벌미식탐험대', href: 'https://www.youtube.com/@MatMatch' },
  { name: 'PODCAST', href: 'https://podcasts.apple.com/kr/channel/%EB%84%A4%EB%AA%A8%EB%84%A4aim/id6753140870' },
  { name: 'ABOUT', href: 'https://home.nemoneai.com' },
  { name: 'BLOG', href: 'https://brunch.co.kr/@you1' },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0c0c0c]
      pb-[80px] md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10
        flex flex-col md:flex-row items-center justify-between gap-6">

        {/* 브랜드 + 카피라잇 */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-[#D4AF37] text-xs font-black tracking-[0.35em] uppercase not-italic">
            네모네AIM
          </span>
          <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase not-italic">
            © NEMONE INC. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* 링크 */}
        <nav className="flex flex-wrap justify-center md:justify-end items-center gap-x-6 gap-y-3 md:gap-8">
          {footerLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors duration-200
                text-[10px] font-black tracking-[0.3em] uppercase no-underline not-italic"
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
