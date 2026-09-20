import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomTabBar from '@/components/BottomTabBar';
import EntitlementBadge from './EntitlementBadge';
import PurchaseSection from './PurchaseSection';
import { getBook, getPartIntroMarkdown, markdownToPlainText, type BookPart } from '@/lib/books';

const BOOK_SLUG = 'civilization';
const BASE_URL = 'https://nemoneai.com';

// 상품 페이지는 정적으로 굽는다(지시서 3장) — 판매 동선이 검색에 안 잡히면 실패다.
// 콘텐츠가 파일 기반이라 재검증 주기를 길게 둬도 원고 수정 후 재배포 시 함께 갱신된다.
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const book = getBook(BOOK_SLUG);
  const title = `${book.title} — 전자책 | 네모네AIM`;
  const description =
    book.subtitle ||
    '프롤로그와 1부 전문을 무료로 공개합니다. 한 끼의 식탁에 담긴 5천 년의 문명사를 읽어보세요.';
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/books` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/books`,
      siteName: '네모네AIM',
      locale: 'ko_KR',
      type: 'book',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/**
 * 목차 한 행 — 서버 컴포넌트다(지시서 2-1장).
 * 번호·제목·부제는 전부 여기서 정적 HTML로 나가고, 우측 상태 배지만 클라이언트 컴포넌트다.
 * 이 파일에 'use client'를 올리면 23개 장 제목이 통째로 크롤러에서 사라지므로 절대 금지.
 */
function ChapterRow({
  chapter,
}: {
  chapter: { slug: string; no: number | null; title: string; subtitle: string; free: boolean };
}) {
  return (
    <li className="flex items-start gap-4 border-b border-white/5 py-5">
      <span className="w-10 shrink-0 pt-0.5 font-classic text-sm font-bold not-italic text-[#D4AF37]/50 tabular-nums">
        {chapter.no !== null ? String(chapter.no).padStart(2, '0') : '—'}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="break-keep text-[15px] font-bold not-italic leading-snug text-white md:text-base">
          {chapter.title}
        </h3>
        {chapter.subtitle && (
          <p className="mt-1 break-keep text-[13px] font-light leading-relaxed text-white/40">
            {chapter.subtitle}
          </p>
        )}
      </div>
      <div className="pt-1">
        <EntitlementBadge bookSlug={BOOK_SLUG} chapterSlug={chapter.slug} isFree={chapter.free} />
      </div>
    </li>
  );
}

function PartBlock({ part, intro }: { part: BookPart; intro: string }) {
  const heading =
    part.kind === 'prologue' ? '프롤로그' : part.kind === 'epilogue' ? '에필로그' : `${part.partNo}부 ${part.title}`;

  return (
    <section className="mb-14">
      <div className="mb-2 flex items-baseline gap-3">
        <h2 className="break-keep font-classic text-xl italic text-[#D4AF37] md:text-2xl">{heading}</h2>
        {part.kind === 'part' && part.chapters.every((c) => c.free) && (
          <span className="shrink-0 rounded-full border border-[#D4AF37]/40 px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-[#D4AF37]">
            전문 무료
          </span>
        )}
      </div>
      {intro && (
        <p className="mb-5 max-w-[680px] break-keep text-sm font-light leading-[1.9] text-white/50">
          {markdownToPlainText(intro, 160)}
        </p>
      )}
      <ul className="list-none p-0">
        {part.chapters.map((ch) => (
          <ChapterRow key={ch.slug} chapter={ch} />
        ))}
      </ul>
    </section>
  );
}

export default function BooksPage() {
  const book = getBook(BOOK_SLUG);
  const intros = new Map(book.parts.map((p) => [p, getPartIntroMarkdown(BOOK_SLUG, p)]));
  const totalChapters = book.parts
    .filter((p) => p.kind === 'part')
    .reduce((sum, p) => sum + p.chapters.length, 0);
  const freeCount = book.parts.reduce((n, p) => n + p.chapters.filter((c) => c.free).length, 0);

  // JSON-LD: 책 자체를 Book으로 선언(지시서 6-2장). 무료 공개분이 있으므로 isAccessibleForFree는
  // 장 단위로 다르지만, 책 레벨에서는 hasPart로 무료 장을 명시해 검색엔진이 미리보기를 인지하게 한다.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    url: `${BASE_URL}/books`,
    inLanguage: 'ko',
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: totalChapters,
    publisher: { '@type': 'Organization', name: '네모네주식회사' },
    hasPart: book.parts
      .flatMap((p) => p.chapters)
      .filter((c) => c.free)
      .map((c) => ({
        '@type': 'Chapter',
        name: c.title,
        url: `${BASE_URL}/books/${BOOK_SLUG}/${c.slug}`,
        isAccessibleForFree: true,
      })),
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto max-w-[900px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
        {/* HERO — 표지 이미지가 아직 없어 타이포 블록으로 구성(지시서 6-1장). 나중에 이미지로 교체 */}
        <section className="mb-16 md:mb-24">
          <p className="mb-6 text-[10px] font-black uppercase tracking-[0.35em] text-[#D4AF37]">
            NEMONE BOOKS
          </p>
          <div className="mb-8 border-y border-[#D4AF37]/25 py-10 md:py-14">
            <h1 className="break-keep font-classic text-4xl italic leading-[1.15] text-white md:text-6xl">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="mt-5 max-w-[620px] break-keep text-base font-light leading-relaxed text-white/60 md:text-lg">
                {book.subtitle}
              </p>
            )}
          </div>
          <dl className="mb-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
            <div className="flex gap-2">
              <dt className="text-white/35">구성</dt>
              <dd className="font-bold text-white/75">프롤로그 + {totalChapters}장 + 에필로그</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-white/35">무료 공개</dt>
              <dd className="font-bold text-[#D4AF37]">{freeCount}편</dd>
            </div>
            {book.audio.totalRuntime && (
              <div className="flex gap-2">
                <dt className="text-white/35">오디오</dt>
                <dd className="font-bold text-white/75">{book.audio.totalRuntime}</dd>
              </div>
            )}
          </dl>
          <PurchaseSection bookSlug={BOOK_SLUG} variant="hero" />
        </section>

        {book.editorNote && (
          <section className="mb-16 border-l-2 border-[#D4AF37]/50 pl-5 md:pl-7">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/70">
              Editor&apos;s Note
            </p>
            <p className="max-w-[680px] break-keep text-[15px] font-light leading-[1.95] text-white/70">
              {book.editorNote}
            </p>
          </section>
        )}

        {/* CONTENTS — 지시서 2-1장 가드레일 적용 지점.
            부 제목·장 번호·장 제목·부제는 전부 이 서버 컴포넌트에서 정적으로 렌더된다. */}
        <section id="contents" className="mb-20 scroll-mt-28">
          <h2 className="mb-10 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
            Contents
          </h2>
          {book.parts.map((part) => (
            <PartBlock
              key={part.kind === 'part' ? `p${part.partNo}` : part.kind}
              part={part}
              intro={intros.get(part) ?? ''}
            />
          ))}
        </section>

        <PurchaseSection bookSlug={BOOK_SLUG} variant="pricing" />
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
