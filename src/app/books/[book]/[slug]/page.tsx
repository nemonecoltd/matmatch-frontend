import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomTabBar from '@/components/BottomTabBar';
import {
  getBook,
  getChapter,
  getChapterMarkdown,
  getFreeChapters,
  getAllChapters,
  markdownToHtml,
  markdownToPlainText,
} from '@/lib/books';

const BASE_URL = 'https://nemoneai.com';
export const revalidate = 3600;

/**
 * 무료 장만 정적 생성한다(지시서 4장·10장).
 * 유료 장이 여기 섞이면 결제 없이 본문이 정적 HTML로 구워져 그대로 노출된다.
 * 그래서 getAllChapters가 아니라 반드시 getFreeChapters를 쓴다.
 */
export function generateStaticParams() {
  return getFreeChapters('civilization').map((c) => ({ book: 'civilization', slug: c.slug }));
}

// 목록에 없는 슬러그(=유료 장 등)로 들어오면 정적 생성분 외에는 전부 404.
export const dynamicParams = false;

interface Props {
  params: Promise<{ book: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book: bookSlug, slug } = await params;
  const chapter = getChapter(bookSlug, slug);
  if (!chapter || !chapter.free) return { title: '찾을 수 없는 페이지' };

  const book = getBook(bookSlug);
  const label =
    chapter.partKind === 'prologue'
      ? '프롤로그'
      : chapter.partKind === 'epilogue'
        ? '에필로그'
        : `${chapter.partNo}부 ${chapter.no}장`;
  const title = `${chapter.title} — ${book.title} ${label} | 네모네AIM`;
  const description =
    chapter.subtitle || markdownToPlainText(getChapterMarkdown(bookSlug, slug), 150);
  const url = `${BASE_URL}/books/${bookSlug}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: '네모네AIM', locale: 'ko_KR', type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function FreeChapterPage({ params }: Props) {
  const { book: bookSlug, slug } = await params;
  const chapter = getChapter(bookSlug, slug);

  // 유료 장은 이 라우트에서 절대 렌더하지 않는다 — 본문을 읽기 전에 먼저 막는다.
  if (!chapter || !chapter.free) notFound();

  const book = getBook(bookSlug);
  const html = markdownToHtml(getChapterMarkdown(bookSlug, slug));

  const all = getAllChapters(bookSlug);
  const idx = all.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const nextIsPaid = Boolean(next && !next.free);

  const label =
    chapter.partKind === 'prologue'
      ? '프롤로그'
      : chapter.partKind === 'epilogue'
        ? '에필로그'
        : `${chapter.partNo}부 ${chapter.partTitle}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: chapter.title,
    url: `${BASE_URL}/books/${bookSlug}/${slug}`,
    inLanguage: 'ko',
    isAccessibleForFree: true,
    isPartOf: {
      '@type': 'Book',
      name: book.title,
      url: `${BASE_URL}/books`,
      bookFormat: 'https://schema.org/EBook',
    },
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto max-w-[900px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
        <nav className="mb-10">
          <Link
            href="/books#contents"
            className="text-[11px] font-bold tracking-[0.15em] text-white/40 no-underline transition-colors hover:text-[#D4AF37]"
          >
            ← {book.title} 목차
          </Link>
        </nav>

        {/* 소제목 '큰 넘버 + 제목 2단' 패턴 — 기존 기사 페이지와 동일한 구성(지시서 6-2장) */}
        <header className="mb-12 border-b border-white/10 pb-10">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
            {label}
          </p>
          <div className="flex items-start gap-5">
            {chapter.no !== null && (
              <span className="shrink-0 font-classic text-5xl italic leading-none text-[#D4AF37]/30 md:text-6xl">
                {String(chapter.no).padStart(2, '0')}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="break-keep font-classic text-3xl italic leading-[1.25] text-white md:text-[2.6rem]">
                {chapter.title}
              </h1>
              {chapter.subtitle && (
                <p className="mt-3 break-keep text-[15px] font-light leading-relaxed text-white/50">
                  {chapter.subtitle}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* 본문 규격은 기존 기사 상세와 동일(.prose-custom, max-w 720px, 17~18px, line-height 2) */}
        <article
          className="prose-custom mx-auto mb-16 max-w-[720px] text-lg font-light not-italic leading-[2] tracking-[-0.01em] text-gray-200"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* 전환 블록 — 무료분이 끝나고 유료로 넘어가는 지점(지시서 6-2장) */}
        {nextIsPaid && next && (
          <aside className="mx-auto mb-14 max-w-[720px] border-t border-[#D4AF37]/30 pt-10 text-center">
            <p className="mb-2 break-keep text-sm text-white/45">
              {chapter.partKind === 'part' ? `${chapter.partNo}부가 끝났습니다.` : '무료 공개분이 끝났습니다.'}
            </p>
            <p className="mb-7 break-keep font-classic text-xl italic text-white md:text-2xl">
              {next.partKind === 'epilogue' ? '에필로그' : `${next.partNo}부 ${next.partTitle}`}
            </p>
            <Link
              href="/books#pricing"
              className="inline-flex items-center justify-center rounded-sm bg-[#D4AF37] px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-[#0c0c0c] no-underline transition-opacity hover:opacity-85"
            >
              전권 이어서 읽기 →
            </Link>
          </aside>
        )}

        <nav className="mx-auto flex max-w-[720px] justify-between gap-4 border-t border-white/10 pt-8 text-[12px] font-bold tracking-[0.1em]">
          {prev && prev.free ? (
            <Link href={`/books/${bookSlug}/${prev.slug}`} className="text-white/50 no-underline hover:text-[#D4AF37]">
              ← {prev.no !== null ? `${prev.no}장` : '프롤로그'}
            </Link>
          ) : (
            <span />
          )}
          {next && next.free ? (
            <Link href={`/books/${bookSlug}/${next.slug}`} className="text-white/50 no-underline hover:text-[#D4AF37]">
              {next.no !== null ? `${next.no}장` : '에필로그'} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
