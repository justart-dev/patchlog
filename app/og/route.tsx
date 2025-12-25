import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');
  const date = searchParams.get('date');

  try {
    // Fallback static image logic could be implemented by redirecting or fetching
    // But since we are in edge, we can't read local files easily without import
    // If title is missing, we create a generic card
    
    // Load font
    const fontData = await fetch(
      new URL('https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.otf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    if (!title) {
        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        background: 'linear-gradient(to bottom right, #4F46E5, #9333EA)',
                        color: 'white',
                    }}
                >
                    <div style={{ fontSize: 80, fontWeight: 700, fontFamily: '"Noto Sans KR"' }}>Patchlog</div>
                    <div style={{ fontSize: 40, marginTop: 20, fontFamily: '"Noto Sans KR"' }}>스팀 게임 한글 패치노트</div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Noto Sans KR',
                        data: fontData,
                        style: 'normal',
                        weight: 700,
                    }
                ]
            }
        );
    }

    const formattedDate = date ? new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: '"Noto Sans KR"',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '40px 60px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 20, color: '#4F46E5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Marvel Rivals
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: '#1e293b',
                lineHeight: 1.2,
                marginBottom: 24,
              }}
            >
              {title}
            </div>
            {formattedDate && (
              <div style={{ fontSize: 28, color: '#64748b', fontWeight: 500 }}>
                {formattedDate} 업데이트
              </div>
            )}
          </div>
          
          <div style={{ position: 'absolute', bottom: 40, right: 40, display: 'flex', alignItems: 'center' }}>
             <div style={{ fontSize: 24, fontWeight: 700, color: '#94a3b8' }}>Patchlog</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans KR',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG Image Generation Error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
