import { NextResponse } from "next/server";

export default function middleware() {
  // 모든 검문을 중단하고 무조건 통과시킨다.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 검사할 경로 목록에서 모두 제외하거나 빈 배열로 둡니다.
    // "/admin/:path*", 
  ],
};