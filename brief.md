 1. Frontend (`matmatch_project`)
   * Framework: Next.js 14.2.3 (App Router)
   * Language: TypeScript
   * Styling: Tailwind CSS (Glassmorphism & Dark Theme 적용)
   * Icons: Lucide React
   * Rendering: SSG(Static Site Generation), ISR(Incremental Static Regeneration)
   * Key Logic:
       * generateStaticParams를 통한 상세 페이지 정적 빌드
       * 유튜브 URL 기반 자동 썸네일 추출 시스템
       * dangerouslySetInnerHTML을 통한 에디터 콘텐츠 렌더링


  2. Backend (`matmatch_backend`)
   * Framework: Python FastAPI
   * ORM: SQLAlchemy
   * Database: PostgreSQL (GCP 기반 원격 DB)
   * Dependencies: uvicorn, python-multipart (파일 업로드), psycopg2-binary
   * Key Logic:
       * 카테고리별 필터링 기능 (Query Parameter 기반)
       * UUID 기반 이미지 파일 저장 및 정적 서빙
       * CRUD API (GET, POST, PUT, DELETE)


  3. Admin (`matmatch_admin`)
   * Framework: Next.js 14.2.3 (App Router)
   * Authentication: NextAuth.js (Google OAuth 2.0) - 단일 관리자(nemonecoltd@gmail.com) 접근 제한
   * Editor: ReactQuill (Rich Text Editor 적용)
   * Key Logic:
       * 이미지 파일 업로드 및 게시물 수정(PUT) 로직
       * Next.js Standalone 배포 방식 적용


  4. Infrastructure & DevOps
   * OS: Linux (Server), Darwin (Local - macOS)
   * Web Server: Nginx (Reverse Proxy & HTTPS Certbot)
   * Process Manager: PM2 (frontend, backend, admin 관리)
   * Deployment Strategy:
       * 로컬 빌드 후 서버 전송: 서버 자원 보호를 위한 Standalone 빌드 방식
       * rsync/scp: 무결성 확보를 위한 메타데이터 제외 전송 (--no-xattrs)
   * Network: 내부망 통신(127.0.0.1:8080) 및 API Proxy 구축


  5. Design Specification (Brand Identity)
   * Font: Noto Serif KR (font-serif), Italic 스타일 고정
   * Theme Color: #0c0c0c (Pure Black), #D4AF37 (Gold)
   * Key Component: 3단 독립 섹션(Article, Ad, Footer), Drop Cap 스타일 적용