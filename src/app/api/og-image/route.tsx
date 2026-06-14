import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '네모네AIM';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0c0c0c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '80px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#D4AF37' }} />
        <div style={{ color: '#D4AF37', fontSize: '20px', fontWeight: 900, letterSpacing: '0.4em', marginBottom: '28px', textTransform: 'uppercase' }}>
          네모네AIM
        </div>
        <div style={{ color: '#ffffff', fontSize: title.length > 28 ? '52px' : '68px', fontWeight: 900, lineHeight: 1.15, fontStyle: 'italic', letterSpacing: '-0.03em', maxWidth: '1000px' }}>
          {title}
        </div>
        <div style={{ position: 'absolute', bottom: '48px', right: '80px', color: 'rgba(255,255,255,0.2)', fontSize: '16px', letterSpacing: '0.12em' }}>
          nemoneai.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
