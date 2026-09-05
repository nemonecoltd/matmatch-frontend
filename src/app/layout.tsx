import "./globals.css"; // 전역 CSS 임포트
import Provider from './Provider';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import SideAds from '@/components/SideAds';
import NaverAnalytics from '@/components/NaverAnalytics';
import Script from 'next/script';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://nemoneai.com'),
  verification: {
    google: '1c2e780ad63d3fcf',
    other: { 'naver-site-verification': '0ec75936430ae731c770662e72c81fd3' },
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '네모네AIM',
  url: 'https://nemoneai.com',
  description: '당신의 시간을 알차게 채워줄 프리미엄 콘텐츠',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://nemoneai.com/?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '네모네 주식회사',
  url: 'https://nemoneai.com',
  logo: 'https://nemoneai.com/icon-512.png',
  contactPoint: { '@type': 'ContactPoint', email: 'nemonecoltd@gmail.com', contactType: 'customer service' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.png?v=3" type="image/png" />
        {/* 모바일 홈 화면 바로가기 아이콘 — manifest/apple-touch-icon이 없어서 안드로이드가
            사이트명 첫 글자("네")로 자동 생성한 아이콘을 쓰던 문제(2026-09-05 사용자 리포트) */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" type="application/rss+xml" title="네모네AIM RSS" href="https://nemoneai.com/rss.xml" />
        {/* adsbygoogle.js 스크립트: 표준 script 태그 사용하여 data-nscript 충돌 회피 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4274957638983041"
          crossOrigin="anonymous"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J888T4BVNZ" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J888T4BVNZ');
          `}
        </Script>
        
        <Provider>
          <AnalyticsTracker />
          <SideAds />
          {children}
        </Provider>

        <NaverAnalytics />
      </body>
    </html>
  );
}