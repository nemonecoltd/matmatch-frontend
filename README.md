# MatMatch 프로젝트 기술 명세 및 아키텍처 가이드

이 문서는 MatMatch 프로젝트의 핵심 구조와 기술 환경, 배포 및 개발 규칙을 정리한 공식 가이드입니다. 모든 개발자 및 AI 어시스턴트는 작업 전 이 내용을 반드시 숙지해야 합니다.

---

## 1. 프로젝트 개요 (Overview)
*   **프로젝트명:** MatMatch (맛매치) - 당신 시간의 알찬 소비
*   **서비스 목적:** 프리미엄 미식/문화 큐레이션 콘텐츠 플랫폼
*   **운영 도메인:** `https://nemoneai.com` (메인), `https://now.nemoneai.com` (지금 여기), `https://admin.nemoneai.com` (어드민)

## 2. 기술 스택 (Tech Stack)
*   **Frontend (프론트엔드):**
    *   **Framework:** Next.js 14 (App Router 방식)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS (Vanilla CSS 병행 사용)
    *   **Icons:** Lucide React
    *   **State/Auth:** NextAuth.js (v4, Google Provider 및 Credentials Provider)
    *   **Animation:** Framer Motion
*   **Backend (백엔드):**
    *   **Framework:** Python 3 + FastAPI
    *   **ORM/DB:** SQLAlchemy + PostgreSQL (GCP Cloud SQL, Port 5432/5433 터널링)
    *   **AI Engine:** Google GenAI SDK (최신 `google-genai` 패키지 적용 완료)
    *   **Authentication:** bcrypt (비밀번호 해싱), passlib (하위 호환성 유지)
*   **Infrastructure (인프라):**
    *   **Server:** Ubuntu Linux (GCP VM)
    *   **Process Manager:** PM2 (프론트엔드/백엔드 모두 PM2로 관리)
    *   **Web Server:** Nginx (리버스 프록시 역할)

## 3. 디렉토리 및 라우팅 구조 (Architecture)
Next.js 14의 **App Router** 패러다임을 따르며, 라우트 그룹을 활용하여 레이아웃을 분리합니다.

*   `src/app/layout.tsx`: **최상위 루트 레이아웃**. (글로벌 CSS, Google Analytics, 사이드 광고 등 전역 설정 담당)
*   `src/app/(main)/`: 메인 홈 화면 및 카테고리별 리스트 레이아웃.
*   `src/app/(viewer)/posts/[id]/`: 개별 콘텐츠 상세 뷰어. (유튜브/스포티파이 임베드, 본문, 댓글 등)
*   `src/components/`: 재사용 가능한 UI 컴포넌트 (NavLinks, BottomTabBar, AdSlot, SideAds 등)

## 4. 핵심 개발 및 배포 원칙 (★ 절대 규칙)
이 프로젝트를 다루는 모든 개발자(또는 AI)는 아래의 규칙을 100% 준수해야 합니다.

1.  **렌더링 방식 (SSG 무결성):**
    *   모든 상세 페이지(`posts/[id]`)는 빌드 타임에 생성되는 **SSG(정적 사이트 생성)**를 원칙으로 합니다. (`generateStaticParams` 필수 사용)
    *   단, 2MB 이상의 대용량 데이터 캐시 초과 에러 방지를 위해 데이터 패칭 시 `{ cache: 'no-store' }`를 활용해 캐시를 우회하여 빌드 안정성을 확보합니다.
2.  **프론트엔드 배포 방식 (Zero-Install / Standalone):**
    *   서버의 자원 부족을 방지하기 위해 **실서버(VM) 위에서 `npm install`이나 `npm run build`를 절대 실행하지 않습니다.**
    *   반드시 로컬 환경에서 빌드(`npm run build`) 후, 생성된 `.next/standalone` 결과물과 `public`, `.next/static` 에셋만을 압축하여 서버로 전송합니다.
    *   서버에서는 압축을 풀고 `PM2`를 통해 `server.js`를 직접 실행합니다. (`PORT=3000 pm2 start server.js --name frontend`)
3.  **광고 및 분석 툴 적용 (Google AdSense & Analytics):**
    *   애드센스와 애널리틱스 스크립트는 반드시 루트 `layout.tsx`에 `next/script` 컴포넌트(`<Script>`)를 사용하여 삽입해야 합니다. 직접 `<script>` 삽입 시 CSS 로딩 붕괴 버그가 발생할 수 있습니다.
    *   루트 도메인의 `public` 폴더 내에 `ads.txt` 파일이 항상 존재해야 합니다.
4.  **디자인 아이덴티티 무결성:**
    *   폰트: `font-serif italic` 조합 고정.
    *   배경색: `#0c0c0c` (Pure Black).
    *   포인트 컬러: `#D4AF37` (Gold).
    *   레이아웃의 여백은 디바이스 크기에 맞게 최소한으로 밀도 있게 유지합니다.

## 5. 백엔드(FastAPI) 업데이트 주의사항
*   가상환경(venv)을 철저히 분리하여 사용합니다.
*   DB 스키마 변경 시 반드시 원격 DB에 쿼리를 선반영한 후 `main.py`를 교체합니다.
*   비밀번호 해싱 모듈은 `passlib`의 72바이트 버그 우회를 위해 순수 `bcrypt` 패키지를 직접 사용합니다.

---
*(이 가이드는 2026년 3월 25일 기준으로 업데이트되었습니다.)*
