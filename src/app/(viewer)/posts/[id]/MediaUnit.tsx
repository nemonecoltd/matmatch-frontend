// READ·LISTEN·WATCH 유닛 — 히어로가 끝난 순수 검정 배경 구간에서 본문 시작 전에
// 노출되는 독립 콘텐츠 단위(기사페이지개편_지시서 3-2장). iframe은 서버에서 그대로
// 렌더 가능해 'use client' 불필요(지시서 1장) — 임베드 URL 계산 로직은 page.tsx가
// 이미 갖고 있는 걸 그대로 props로 받아 쓰고, 여기선 카드 wrapper만 새로 제공한다.
export default function MediaUnit({
  videoId,
  spotifyUrl,
  applePodcastUrl,
}: {
  videoId: string | null;
  spotifyUrl: string | null;
  applePodcastUrl: string | null;
}) {
  if (!videoId && !spotifyUrl && !applePodcastUrl) return null;

  return (
    <div className="max-w-[720px] mx-auto mb-16 flex flex-col gap-6 not-italic">
      {videoId && (
        <div>
          <p className="text-[#D4AF37] text-[11px] font-black tracking-[0.35em] uppercase mb-3">🎬 WATCH</p>
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} allowFullScreen />
          </div>
        </div>
      )}

      {spotifyUrl && (
        <div>
          <p className="text-[#D4AF37] text-[11px] font-black tracking-[0.35em] uppercase mb-3">🎧 LISTEN</p>
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            <iframe src={spotifyUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
          </div>
        </div>
      )}

      {applePodcastUrl && (
        <div>
          <p className="text-[#D4AF37] text-[11px] font-black tracking-[0.35em] uppercase mb-3">🎧 LISTEN</p>
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <iframe
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              frameBorder="0"
              height="175"
              style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', borderRadius: '10px' }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={applePodcastUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
