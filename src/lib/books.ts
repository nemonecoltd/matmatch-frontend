/**
 * 전자책 콘텐츠 레이어 — `content/books/<slug>/` 의 book.json + 장별 .md를 읽는다.
 *
 * Phase 1은 DB가 아니라 파일 기반(지시서 4장). 이 모듈은 **서버에서만** 호출한다 —
 * 특히 유료 장 본문이 클라이언트 번들에 섞이면 결제 없이 본문이 새어나간다(지시서 4장·10장).
 * 별도 'server-only' 패키지를 쓰지 않는 이유: 아래 node:fs import 자체가 클라이언트
 * 컴포넌트에서 빌드 에러("Can't resolve 'fs'")를 내므로 같은 시점에 같은 보호가 걸린다.
 * 이 파일에 fs를 쓰지 않는 함수만 남게 되는 날이 오면 그때 server-only 도입을 검토할 것.
 */
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'books');

export interface BookChapter {
  slug: string;
  no: number | null;
  title: string;
  subtitle: string;
  free: boolean;
  audioUrl: string;
}

export interface BookPart {
  kind: 'prologue' | 'part' | 'epilogue';
  partNo?: number;
  title?: string;
  introFile?: string;
  chapters: BookChapter[];
}

export interface Book {
  slug: string;
  title: string;
  subtitle: string;
  editorNote: string;
  audio: { sampleUrl: string; totalRuntime: string };
  parts: BookPart[];
}

/** 목차 렌더링에 필요한, 장 + 그 장이 속한 부 정보를 합친 형태 */
export interface ChapterRef extends BookChapter {
  partKind: BookPart['kind'];
  partNo?: number;
  partTitle?: string;
}

export function getBook(bookSlug: string): Book {
  const file = path.join(CONTENT_ROOT, bookSlug, 'book.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as Book;
}

/** 모든 장을 목차 순서(프롤로그 → 1~5부 → 에필로그)대로 평탄화 */
export function getAllChapters(bookSlug: string): ChapterRef[] {
  return getBook(bookSlug).parts.flatMap((part) =>
    part.chapters.map((ch) => ({
      ...ch,
      partKind: part.kind,
      partNo: part.partNo,
      partTitle: part.title,
    })),
  );
}

export function getChapter(bookSlug: string, chapterSlug: string): ChapterRef | null {
  return getAllChapters(bookSlug).find((c) => c.slug === chapterSlug) ?? null;
}

/**
 * 무료 장만 반환 — `/books/[book]/[slug]`의 generateStaticParams가 쓴다.
 * 유료 장이 정적 HTML로 구워지면 결제 없이 본문이 노출되므로(지시서 4장·10장),
 * 정적 생성 대상은 반드시 이 함수만 통해서 구한다.
 */
export function getFreeChapters(bookSlug: string): ChapterRef[] {
  return getAllChapters(bookSlug).filter((c) => c.free);
}

/** 원고 본문(마크다운 원문). 유료 장도 읽을 수 있으므로 호출 전 권한 확인은 호출자 책임. */
export function getChapterMarkdown(bookSlug: string, chapterSlug: string): string {
  // 슬러그가 경로 조작에 쓰이지 않게 화이트리스트(book.json에 실재하는 슬러그)로만 허용
  const known = getAllChapters(bookSlug).some((c) => c.slug === chapterSlug);
  if (!known) throw new Error(`알 수 없는 장 슬러그: ${chapterSlug}`);
  return fs.readFileSync(path.join(CONTENT_ROOT, bookSlug, `${chapterSlug}.md`), 'utf-8');
}

/** 부 도입부(p1intro.md 등) 본문. 해당 부에 도입부가 없으면 빈 문자열. */
export function getPartIntroMarkdown(bookSlug: string, part: BookPart): string {
  if (!part.introFile) return '';
  const file = path.join(CONTENT_ROOT, bookSlug, path.basename(part.introFile));
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `**볼드**` → <strong>. escapeHtml 이후에 적용해야 태그가 깨지지 않는다. */
const inline = (s: string) => escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/**
 * 원고 마크다운 → HTML. 기존 기사 본문과 같은 `.prose-custom`으로 렌더하기 위한 변환이다.
 *
 * 범용 마크다운 파서를 쓰지 않고 직접 변환하는 이유: 원고 전체(23장)에서 실제로 쓰인 문법이
 * 문단 / `---` 장면전환 / `>` 인용(한 입 과학 박스) / `**볼드**` 네 가지뿐임을 실측으로 확인했다
 * (링크·이미지·리스트·코드·기울임 0건, 2026-09-20). 의존성을 늘리지 않고 이 범위만 정확히 다룬다.
 * 원고에 새 문법이 등장하면 이 함수를 먼저 확장할 것.
 */
export function markdownToHtml(md: string): string {
  const blocks = md.trim().split(/\n{2,}/);
  const html: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    if (/^-{3,}$/.test(block)) {
      html.push('<hr />');
      continue;
    }

    if (block.startsWith('>')) {
      // 인용 블록의 각 줄에서 '> '를 떼고, 줄바꿈은 <br />로 유지
      const inner = block
        .split('\n')
        .map((line) => inline(line.replace(/^>\s?/, '')))
        .join('<br />');
      html.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    html.push(`<p>${block.split('\n').map(inline).join('<br />')}</p>`);
  }

  return html.join('\n');
}

/** 메타 설명·미리보기용 평문 추출 */
export function markdownToPlainText(md: string, maxLength?: number): string {
  const text = md
    .replace(/^-{3,}$/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return maxLength && text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}
