'use client'

import { useState } from 'react'

interface KeyParam {
  name: string
  shortExplanation: string
  tips: string
}

interface Props {
  pluginName: string
  format: string
  parameters: KeyParam[]
  hasData: boolean
  loading: boolean
  webUrl?: string
  onClose: () => void
  onLogout?: () => void
}

export function OverlayPanel({ pluginName, format, parameters, hasData, loading, webUrl = 'http://localhost:3000', onClose, onLogout }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 320,
        background: hovered ? 'rgba(26, 25, 22, 0.98)' : 'rgba(26, 25, 22, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: hovered ? '0 12px 48px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.3)',
        fontFamily: 'Instrument Sans, sans-serif',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: hovered ? 1 : 0.85,
        transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
        color: 'white',
      }}
    >
      {/* Header draggable */}
      <div
        data-tauri-drag-region
        style={{
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'move',
        }}
      >
        <div style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 9,
            color: '#7CBF3F',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: 4,
          }}>
            Plugin<span style={{ color: 'white', opacity: 0.5 }}>Base</span>
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 15,
            fontWeight: 800,
            color: 'white',
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em'
          }}>
            {pluginName}
          </div>
          {format && (
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 2,
              fontWeight: 500,
            }}>
              {format}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)',
            width: 24,
            height: 24,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'all 200ms'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'white')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ×
        </button>
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px', maxHeight: 420, overflowY: 'auto' }}>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 0' }}>
            <div style={{ 
                width: 24, height: 24, 
                border: '2px solid rgba(124,191,63,0.2)', 
                borderTopColor: '#7CBF3F', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
            }} />
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Analyse studio...
            </div>
          </div>
        )}

        {!loading && !hasData && (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
              Pas encore de fiche pour ce plugin dans ta base.
            </div>
            <a
              href={`${webUrl}/inventory`}
              target="_blank"
              rel="noreferrer"
              style={{ 
                display: 'inline-block',
                padding: '8px 16px',
                background: '#7CBF3F',
                borderRadius: 10,
                fontSize: 12, 
                color: '#1A1916', 
                textDecoration: 'none', 
                fontFamily: 'Instrument Sans, sans-serif',
                fontWeight: 700
              }}
            >
              Ajouter manuellement
            </a>
          </div>
        )}

        {!loading && hasData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#7CBF3F', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>
              Paramètres Clés
            </div>
            {parameters.map((param, i) => (
              <div
                key={param.name}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  background: 'rgba(124,191,63,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#7CBF3F',
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'white',
                    marginBottom: 4,
                  }}>
                    {param.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                    {param.shortExplanation}
                  </div>
                  {param.tips && (
                    <div style={{ 
                        marginTop: 6, 
                        fontSize: 11, 
                        color: '#7CBF3F', 
                        fontStyle: 'italic',
                        opacity: 0.8
                    }}>
                      💡 {param.tips}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7CBF3F', boxShadow: '0 0 8px #7CBF3F' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Live Sync
            </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={webUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 9,
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7CBF3F')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            Détails →
          </a>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Déconnexion"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
                fontSize: 9,
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: 0,
                transition: 'color 200ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(192,57,43,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              ⎋ Quitter
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}
