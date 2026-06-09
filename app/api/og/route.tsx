import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function clearTurkishChars(str: string): string {
  return str
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Dinamik Parametreler
    const loc = clearTurkishChars(searchParams.get('loc')?.slice(0, 50) || 'DUNYA').toUpperCase();
    const cat = clearTurkishChars(searchParams.get('cat')?.slice(0, 30) || 'Elite Partner');
    const status = clearTurkishChars(searchParams.get('status') || 'AKTIF').toUpperCase();
    const verified = searchParams.get('verified') === 'true';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 2px 2px, #111 1px, transparent 0)',
            backgroundSize: '40px 40px',
            fontFamily: 'serif',
            position: 'relative',
          }}
        >
          {/* Soyut Arka Plan Işıltıları */}
          <div style={{ display: 'flex', position: 'absolute', top: -100, left: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(225,29,72,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(5, 5, 5, 0.9)',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              borderRadius: '48px',
              padding: '80px',
              width: '90%',
              height: '80%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
            }}
          >
            {/* Üst Bilgi Satırı */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', width: 16, height: 16, borderRadius: '50%', backgroundColor: '#e11d48', marginRight: 12, boxShadow: '0 0 10px #e11d48' }} />
                <span style={{ color: '#e11d48', fontSize: 24, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                  ESCORTVIP
                </span>
              </div>
              <div style={{ display: 'flex', backgroundColor: '#e11d48', color: 'white', padding: '8px 20px', borderRadius: '12px', fontSize: 18, fontWeight: 900 }}>
                {status} 7/24
              </div>
            </div>

            {/* Ana Başlık */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <h1 style={{ fontSize: 90, fontWeight: 900, color: 'white', margin: 0, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {loc}
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
                <div style={{ display: 'flex', height: 2, width: 80, backgroundColor: '#e11d48', marginRight: 20 }} />
                <span style={{ fontSize: 42, color: '#a1a1aa', fontWeight: 300 }}>{cat} List</span>
              </div>
            </div>

            {/* Alt Bilgi ve Rozetler */}
            <div style={{ display: 'flex', marginTop: 'auto', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#52525b', fontSize: 20, fontWeight: 600, letterSpacing: '0.1em' }}>istanbulescort.blog</span>
                <span style={{ color: '#27272a', fontSize: 16 }}>DISCREET & VERIFIED NETWORK</span>
              </div>
              
              {verified ? (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(225, 29, 72, 0.1)', padding: '15px 30px', borderRadius: '20px', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span style={{ color: '#e11d48', marginLeft: 15, fontSize: 24, fontWeight: 900 }}>ONAYLI PROFİL</span>
                </div>
              ) : <div style={{ display: 'flex' }} />}
            </div>
          </div>
        </div>

      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
