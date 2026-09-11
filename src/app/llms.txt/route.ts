// GEO(생성엔진 최적화) — ChatGPT/Perplexity/Claude 등에게 주는 사이트 안내서(2026-09-11).
// now(PACE)에 먼저 적용한 것과 동일한 패턴 — 정적 파일이 아니라 라우트로 서빙.
// 참고: https://github.com/leopard627/fire-your-seo-agency (references/geo.md)
export const revalidate = 86400 // 하루 1회 재생성 — 내용이 자주 바뀌지 않음

const BASE_URL = 'https://nemoneai.com'

export async function GET() {
  const body = `# 네모네AIM (NEMONE AIM)

> 당신의 시간을 알차게 채워줄 프리미엄 콘텐츠 매거진. 미식(Taste)·문화(Culture)·라이프(Life)·
> 기술(Tech), 네 가지 렌즈로 세상을 다룹니다.

## 핵심 페이지
- [Taste](${BASE_URL}/category/Taste): 우리가 먹는 것의 역사와 철학
- [Culture](${BASE_URL}/category/Culture): 사람들이 만들어온 다양한 삶의 방식
- [Life](${BASE_URL}/category/Life): 우리가 살아가는 공간과 일상
- [Tech](${BASE_URL}/category/Tech): 기술이 바꾸는 우리의 미래

## 발행 정책
- 네모네 주식회사가 직접 기획·제작하는 에디토리얼 콘텐츠
- 인용 시 표기: 네모네AIM (nemoneai.com)

## 계열 서비스
- [NEMONE PACE](https://now.nemoneai.com): 서울·부산·제주 팝업스토어 실시간 랭킹
- [NEMONE PLANTS](https://plants.nemoneai.com): 식물도감 & AI 케어 가이드
- [NEMONE MSM](https://msm.nemoneai.com): 국내 주식 AI 분석
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
