import { useState, useEffect, useRef } from 'react'

interface Props {
  onLogin: (email: string, password: string) => Promise<string | null>
  onLoginWithToken: (token: string) => Promise<string | null>
}

export function LoginPanel({ onLogin, onLoginWithToken }: Props) {
  const [mode, setMode] = useState<'password' | 'token'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const passwordRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  // Charger l'email mémorisé au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pluginbase_overlay_email')
      if (saved) {
        setEmail(saved)
        // Email connu → focus direct sur le mot de passe
        setTimeout(() => passwordRef.current?.focus(), 100)
      } else {
        setTimeout(() => emailRef.current?.focus(), 100)
      }
    } catch {}
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'password' && (!email || !password)) return
    if (mode === 'token' && !token.trim()) return
    setLoading(true)
    setError('')

    let err: string | null
    if (mode === 'token') {
      err = await onLoginWithToken(token.trim())
    } else {
      err = await onLogin(email, password)
      if (!err) {
        // Mémoriser l'email pour la prochaine fois
        try { localStorage.setItem('pluginbase_overlay_email', email) } catch {}
      }
    }

    if (err) setError(err)
    setLoading(false)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10,
    padding: '9px 12px',
    fontSize: 13,
    color: 'white',
    outline: 'none',
    fontFamily: 'Instrument Sans, sans-serif',
    transition: 'border-color 200ms',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{
      width: 300,
      background: 'rgba(26, 25, 22, 0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      fontFamily: 'Instrument Sans, sans-serif',
      color: 'white',
    }}>
      {/* Header draggable */}
      <div
        data-tauri-drag-region
        style={{
          padding: '18px 20px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: 'move',
        }}
      >
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 9,
          color: '#7CBF3F',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: 6,
          pointerEvents: 'none',
        }}>
          Plugin<span style={{ color: 'white', opacity: 0.4 }}>Base</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>Overlay</span>
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '-0.01em',
          pointerEvents: 'none',
        }}>
          Connecte-toi pour activer
        </div>
        <div style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 3,
          pointerEvents: 'none',
        }}>
          Détection de plugins + suppression à distance
        </div>
      </div>

      {/* Tabs mode */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {(['password', 'token'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError('') }}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === m ? '2px solid #7CBF3F' : '2px solid transparent',
              color: mode === m ? '#7CBF3F' : 'rgba(255,255,255,0.3)',
              fontFamily: 'DM Mono, monospace',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 200ms',
              marginBottom: -1,
            }}
          >
            {m === 'password' ? 'Email + mdp' : 'Token rapide'}
          </button>
        ))}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {mode === 'password' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@studio.fr"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,191,63,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Mot de passe
              </label>
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,191,63,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Token PluginBase
            </label>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4, lineHeight: 1.5 }}>
              Copie ton token depuis <span style={{ color: '#7CBF3F' }}>Mon studio → Scanner</span> sur le site.
            </div>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Colle ton token ici..."
              rows={3}
              style={{
                ...inputStyle,
                resize: 'none',
                fontSize: 11,
                fontFamily: 'DM Mono, monospace',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,191,63,0.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.15)',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: '#e57373',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (mode === 'password' ? (!email || !password) : !token.trim())}
          style={{
            marginTop: 4,
            background: loading ? 'rgba(124,191,63,0.4)' : '#7CBF3F',
            border: 'none',
            borderRadius: 10,
            padding: '10px 0',
            fontSize: 13,
            fontWeight: 700,
            color: '#1A1916',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Syne, sans-serif',
            transition: 'background 200ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 14, height: 14,
                border: '2px solid rgba(26,25,22,0.3)',
                borderTopColor: '#1A1916',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Connexion...
            </>
          ) : (
            'Se connecter →'
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}
