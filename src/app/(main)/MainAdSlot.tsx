"use client";
// @/ 대신 상대 경로(../../../)를 사용하여 확실하게 연결합니다.
import AdBanner from "../components/AdBanner"; 

export default function MainAdSlot() {
  return (
    <div className="md:col-span-2 lg:col-span-3 py-10 border-y border-white/5 my-10 flex justify-center bg-black/20">
      <AdBanner dataAdSlot="7051929128" />
    </div>
  );
}