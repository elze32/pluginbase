import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  // Chargement des polices (facultatif pour un proto simple, mais mieux pour le design)
  // On utilise des polices système ou par défaut si fetch échoue
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#F7F6F3',
          padding: '80px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '80px',
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: 'monospace',
            color: '#1A1916',
          }}
        >
          PluginBase
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 700,
              color: '#1A1916',
              lineHeight: 1.1,
              marginBottom: '10px',
            }}
          >
            Tu as <span style={{ color: '#7CBF3F' }}>247 plugins</span>.
          </div>
          <div
            style={{
              fontSize: '80px',
              fontWeight: 700,
              color: '#1A1916',
              lineHeight: 1.1,
            }}
          >
            Tu en utilises <span style={{ color: '#7CBF3F' }}>12</span>.
          </div>
        </div>

        <div
          style={{
            marginTop: '60px',
            fontSize: '32px',
            color: '#6B6760',
            maxWidth: '800px',
          }}
        >
          Assistant de lucidité pour ta collection de plugins
        </div>

        {/* Décoration subtile */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            width: '120px',
            height: '120px',
            backgroundColor: '#7CBF3F',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            color: 'white',
            fontWeight: 800,
          }}
        >
          P
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
