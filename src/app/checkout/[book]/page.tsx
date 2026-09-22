import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomTabBar from '@/components/BottomTabBar';
import { getBook } from '@/lib/books';

// 결제 연동 전 단계 — 크롤러가 이 페이지를 상품 페이지로 오인하지 않도록 색인 대상에서 제외한다.
export const metadata: Metadata = {
  title: '결제 준비 중 | 네모네AIM',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

export default function CheckoutPage({ params }: { params: { book: string } }) {
  let title = '전자책';
  try {
    title = getBook(params.book).title;
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Header />
      <main className="mx-auto flex max-w-[600px] flex-col items-center px-5 pb-28 pt-32 text-center md:pt-40">
        <p className="mb-6 text-[10px] font-black uppercase tracking-[0.35em] text-[#D4AF37]">
          NEMONE BOOKS
        </p>
        <h1 className="mb-4 break-keep font-classic text-2xl italic leading-snug text-white md:text-3xl">
          결제 오픈 준비 중입니다
        </h1>
        <p className="mb-10 max-w-[440px] break-keep text-sm font-light leading-relaxed text-white/50">
          《{title}》 전권 구매 기능을 준비하고 있습니다. 지금은 프롤로그와 1부 전문을 무료로 읽으실 수
          있습니다.
        </p>
        <Link
          href={`/books/${params.book}/prologue`}
          className="inline-flex items-center justify-center rounded-sm bg-[#D4AF37] px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-[#0c0c0c] no-underline transition-opacity hover:opacity-85"
        >
          프롤로그 무료로 읽기
        </Link>
        <Link
          href="/books"
          className="mt-4 text-[13px] font-light text-white/40 underline underline-offset-4 hover:text-white/70"
        >
          책 소개로 돌아가기
        </Link>
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
