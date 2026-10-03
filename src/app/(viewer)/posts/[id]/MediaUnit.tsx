// READ·LISTEN·WATCH 유닛 — 히어로가 끝난 순수 검정 배경 구간에서 본문 시작 전에
// 노출되는 독립 콘텐츠 단위(기사페이지개편_지시서 3-2장). iframe은 서버에서 그대로
// 렌더 가능해 'use client' 불필요(지시서 1장) — 임베드 URL 계산 로직은 page.tsx가
// 이미 갖고 있는 걸 그대로 props로 받아 쓰고, 여기선 카드 wrapper만 새로 제공한다.
export default function MediaUnit({
  videoId,
  spotifyUrl,
  applePodcastUrl,
  audioUrl = null,
}: {
  videoId: string | null;
  spotifyUrl: string | null;
  applePodcastUrl: string | null;
  // 자체 호스팅 오디오(우리 GCS의 m4a 등) — 외부 플랫폼 임베드가 없어 <audio>로 직접 재생한다.
  audioUrl?: string | null;
}) {
  if (!videoId && !spotifyUrl && !applePodcastUrl && !audioUrl) return null;

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

      {audioUrl && (
        <div>
          <p className="text-[#D4AF37] text-[11px] font-black tracking-[0.35em] uppercase mb-3">🎧 LISTEN</p>
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black px-5 py-5">
            {/* preload="none": 35MB급 파일이라 재생 버튼을 누르기 전까지 내려받지 않게 한다
                (기사 첫 로딩 속도·GCS 전송량 모두에 영향). GCS가 Range 요청을 지원해
                재생 시작 시점부터 필요한 만큼만 받아온다. */}
            <audio controls preload="none" src={audioUrl} className="w-full">
              오디오 재생을 지원하지 않는 브라우저입니다.
            </audio>
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
