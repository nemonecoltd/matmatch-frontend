import "./globals.css"; // 전역 CSS 임포트
import Provider from './Provider';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import SideAds from '@/components/SideAds';
import NaverAnalytics from '@/components/NaverAnalytics';
import Script from 'next/script';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://nemoneai.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* adsbygoogle.js 스크립트: 표준 script 태그 사용하여 data-nscript 충돌 회피 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4274957638983041"
          crossOrigin="anonymous"
        />
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