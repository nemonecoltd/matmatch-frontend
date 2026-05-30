"use client";

import Script from 'next/script';

export default function NaverAnalytics() {
  return (
    <Script
      src="//wcs.pstatic.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (!window.wcs_add) window.wcs_add = {};
        window.wcs_add["wa"] = "1944a0c151404f0";
        if (window.wcs) {
          wcs_do();
        }
      }}
    />
  );
}
