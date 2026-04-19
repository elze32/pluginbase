import Image from 'next/image'

interface Props {
  src: string | null
  alt: string
  pluginId: string
  isUserScreenshot: boolean
  hasAnnotations: boolean
}

export function PluginGuideImage({ src, alt, pluginId, isUserScreenshot, hasAnnotations }: Props) {
  if (!src) {
    return (
      <div style={{
        background: '#F0EEE9',
        borderRadius: 10,
        border: '1px dashed rgba(26,25,22,0.15)',
        padding: '40px 24px',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📸</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          Ajoute une screenshot de ce plugin
        </div>
        <div style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          maxWidth: 320,
          margin: '0 auto 16px',
          lineHeight: 1.6,
        }}>
          Une photo de l'interface t'aidera à faire le lien entre les explications et les vrais boutons.
        </div>
        <a
          href={`/plugin/${pluginId}`}
          style={{
            display: 'inline-block',
            background: 'var(--accent)',
            color: '#1A1916',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 13,
            padding: '8px 16px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Uploader une screenshot →
        </a>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {isUserScreenshot ? '📸 Ta screenshot' : '🖼 Image officielle'}
        </span>

        {isUserScreenshot && hasAnnotations && (
          <a
            href={`/plugin/${pluginId}`}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', textDecoration: 'none' }}
          >
            Voir les annotations →
          </a>
        )}
        {isUserScreenshot && !hasAnnotations && (
          <a
            href={`/plugin/${pluginId}`}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', textDecoration: 'none' }}
          >
            Analyser avec Claude Vision →
          </a>
        )}
      </div>

      <div style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid rgba(26,25,22,0.08)',
        background: '#1a1a18',
        position: 'relative',
        minHeight: 240,
      }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </div>

      {!isUserScreenshot && (
        <div style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          marginTop: 6,
          textAlign: 'center',
        }}>
          Image officielle du fabricant ·{' '}
          <a
            href={`/plugin/${pluginId}`}
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            Remplace par ta propre screenshot
          </a>
        </div>
      )}
    </div>
  )
}
