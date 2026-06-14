import type { Metadata } from "next";
import BottomTabBar from '@/components/BottomTabBar'; 
import Footer from '@/components/Footer'; 
import Header from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL('https://nemoneai.com'),
  title: {
    template: '%s | 네모네AIM',
    default: '네모네AIM - 당신 시간의 알찬 소비, 사람과 문명의 변화를 탐구하는 미디어', 
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-[#0c0c0c]">
        <Header />
        <main className="pt-32 pb-[5.5rem]">{children}</main>
      </div>
      <div className="md:hidden" suppressHydrationWarning>
        <BottomTabBar />
      </div>
      <Footer />
    </>
  );
}
