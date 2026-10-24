import { NextRequest, NextResponse } from "next/server";

// 네모네AIM 안드로이드 앱(com.nemoneai.matmatch)은 nemoneai.com을 WebView로 띄운다.
// 안드로이드 WebView는 모든 요청에 X-Requested-With: <앱 패키지명>을 붙이므로,
// 이미 설치된 앱(업데이트 전)도 이 헤더로 정확히 구분할 수 있다.
// (카카오톡·네이버 등 다른 앱의 인앱브라우저는 패키지명이 달라 해당되지 않는다.)
// 앱 사용자는 포털(/) 대신 기존 AIM 홈(/aim)으로 보낸다. 일반 브라우저(모바일 웹 포함)는 포털을 그대로 본다.
const APP_PACKAGE = "com.nemoneai.matmatch";

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/" && req.headers.get("x-requested-with") === APP_PACKAGE) {
    const res = NextResponse.redirect(new URL("/aim", req.url), 307);
    res.headers.set("Vary", "X-Requested-With");
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
