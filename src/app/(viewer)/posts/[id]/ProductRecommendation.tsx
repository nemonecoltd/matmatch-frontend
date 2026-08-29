export interface AffiliateProduct {
  id: number;
  label: string;
  coupang_url: string;
  image_url: string | null;
  match_keywords: string[];
}

// 관리자가 직접 고른 상품이 있으면 그걸 최우선으로 쓰고, 없으면 콤마구분 tags
// 문자열과 match_keywords를 부분일치시켜 하나를 고른다(plants 서비스와 동일 로직,
// 여기선 tags가 배열이 아니라 문자열이라 split만 다르다).
export function pickProduct(
  products: AffiliateProduct[],
  affiliateProductId: number | null,
  tags: string | null
): AffiliateProduct | null {
  if (affiliateProductId) {
    const picked = products.find((p) => p.id === affiliateProductId);
    if (picked) return picked;
  }

  if (!tags) return null;
  const normalized = tags.toLowerCase();
  const scored = products
    .map((p) => ({
      product: p,
      score: p.match_keywords.filter((k) => normalized.includes(k.toLowerCase())).length,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.product ?? null;
}

export default function ProductRecommendation({ product }: { product: AffiliateProduct }) {
  return (
    <div className="max-w-7xl mx-auto mb-10">
      <a
        href={product.coupang_url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="group flex items-center gap-4 no-underline bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-[#D4AF37]/40 transition-colors"
      >
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-black tracking-widest uppercase text-[#D4AF37]/70">추천 아이템</span>
          <p className="text-base md:text-lg font-bold italic text-white/80 group-hover:text-white transition-colors truncate">
            {product.label} 보러가기
          </p>
        </div>
        <span className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors text-xl" aria-hidden>
          →
        </span>
      </a>
      <p className="text-[10px] text-white/30 mt-2 leading-relaxed">
        이 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
