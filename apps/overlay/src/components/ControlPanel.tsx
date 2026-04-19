import { useState, useEffect, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { open as shellOpen } from '@tauri-apps/api/shell'

interface Props {
  config: { token: string; api_url: string } | null
  webUrl: string
  apiUrl: string
  onLogout: () => void
}

interface KeyParam {
  name: string
  shortExplanation: string
  tips: string
}

interface DetectedPlugin {
  pluginName: string
  format: string
  parameters: KeyParam[]
  hasData: boolean
  loading: boolean
}

interface DeletionResult {
  id: string
  plugin_name: string
  install_path: string
  success: boolean
  error: string | null
}

export function ControlPanel({ config, webUrl, apiUrl, onLogout }: Props) {
  const [pinned, setPinned] = useState(false)
  const [plugin, setPlugin] = useState<DetectedPlugin | null>(null)
  const [hovered, setHovered] = useState(false)
  const [debugOpen, setDebugOpen] = useState(false)
  const [debugTitles, setDebugTitles] = useState<string[]>([])
  const [debugDetected, setDebugDetected] = useState<{ plugin_name: string; format: string; raw_title: string } | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [deletionResults, setDeletionResults] = useState<DeletionResult[]>([])
  const [deletionRunning, setDeletionRunning] = useState(false)

  const refreshDebug = useCallback(async () => {
    const result = await invoke<{ titles: string[]; detected: { plugin_name: string; format: string; raw_title: string } | null }>('get_detection_debug')
    setDebugTitles(result.titles)
    setDebugDetected(result.detected)
  }, [])

  // ── Poll du nombre de suppressions en attente ───────────────────
  useEffect(() => {
    if (!config) return
    async function pollCount() {
      try {
        const count = await invoke<number>('get_pending_deletions_count')
        setPendingCount(count)
      } catch { /* silencieux */ }
    }
    pollCount()
    const interval = setInterval(pollCount, 15000)
    return () => clearInterval(interval)
  }, [config])

  async function handleForceDeletion() {
    setDeletionRunning(true)
    setDeletionResults([])
    try {
      const results = await invoke<DeletionResult[]>('force_deletion_check')
      setDeletionResults(results)
      // On ne met pas pendingCount à 0 ici car certains peuvent avoir échoué
      const count = await invoke<number>('get_pending_deletions_count')
      setPendingCount(count)
    } catch (e) {
      setDeletionResults([{ id: 'err', plugin_name: 'Erreur', install_path: '', success: false, error: String(e) }])
    } finally {
      setDeletionRunning(false)
    }
  }

  async function handleCancelAll() {
    if (!config) return
    try {
      await fetch(`${apiUrl}/api/v1/scanner/cancel-all-deletions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.token}` },
      })
      setPendingCount(0)
      setDeletionResults([])
    } catch { /* silencieux */ }
  }

  async function handleCancelOne(id: string) {
    if (!config) return
    try {
      await fetch(`${apiUrl}/api/v1/scanner/cancel-deletion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.token}`,
        },
        body: JSON.stringify({ id }),
      })
      setDeletionResults(prev => prev.filter(r => r.id !== id))
      setPendingCount(prev => Math.max(0, prev - 1))
    } catch { /* silencieux */ }
  }

  // ── Polling du plugin actif (toutes les 800ms) ──────────────────
  useEffect(() => {
    if (!config) return
    const cfg = config

    let lastName: string | null = null
    let loadingFiche = false

    async function poll() {
      try {
        const active = await invoke<{ plugin_name: string; format: string; raw_title: string } | null>('get_active_plugin')

        if (!active) {
          // Aucun plugin → effacer après délai
          if (lastName !== null) {
            lastName = null
            setTimeout(() => setPlugin(null), 2000)
          }
          return
        }

        const { plugin_name: pluginName, format } = active

        // Même plugin → rien à faire
        if (pluginName === lastName) return
        lastName = pluginName

        // Nouveau plugin détecté
        setPlugin({ pluginName, format, parameters: [], hasData: false, loading: true })

        if (loadingFiche) return
        loadingFiche = true

        try {
          const res = await fetch(`${apiUrl}/api/v1/guides/search/${encodeURIComponent(pluginName)}`, {
            headers: { Authorization: `Bearer ${cfg.token}` },
          })
          if (res.ok) {
            const data = await res.json()
            setPlugin({
              pluginName, format,
              parameters: (data.keyParams ?? []).map((p: any) => ({
                name: p.name,
                shortExplanation: p.role,
                tips: p.tip,
              })),
              hasData: true,
              loading: false,
            })
          } else {
            setPlugin(p => p ? { ...p, hasData: false, loading: false } : null)
          }
        } catch {
          setPlugin(p => p ? { ...p, hasData: false, loading: false } : null)
        } finally {
          loadingFiche = false
        }
      } catch {
        // invoke peut échouer si le runtime Tauri n'est pas prêt
      }
    }

    poll()
    const interval = setInterval(poll, 800)
    return () => clearInterval(interval)
  }, [config, apiUrl])

  // ── Pin / Unpin ──────────────────────────────────────────────────
  async function togglePin() {
    const next = !pinned
    setPinned(next)
    await appWindow.setAlwaysOnTop(next)
  }

  const bg = pinned
    ? hovered ? 'rgba(26,25,22,0.98)' : 'rgba(26,25,22,0.92)'
    : '#F7F6F3'

  const textColor = pinned ? 'white' : '#1A1916'
  const mutedColor = pinned ? 'rgba(255,255,255,0.4)' : '#A8A49E'
  const cardBg = pinned ? 'rgba(255,255,255,0.06)' : 'white'
  const cardBorder = pinned ? 'rgba(255,255,255,0.08)' : 'rgba(26,25,22,0.08)'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        height: '100vh',
        background: bg,
        backdropFilter: pinned ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: pinned ? 'blur(20px)' : 'none',
        fontFamily: 'Instrument Sans, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 300ms ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Header draggable */}
      <div
        data-tauri-drag-region
        style={{
          padding: '14px 16px 12px',
          background: pinned ? 'rgba(255,255,255,0.03)' : '#1A1916',
          borderBottom: `1px solid ${pinned ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
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
            marginBottom: 3,
          }}>
            Plugin<span style={{ color: 'white', opacity: 0.4 }}>Base</span>
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 13,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.01em',
          }}>
            {plugin ? plugin.pluginName : 'Studio Control'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Indicateur connexion */}
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: config ? '#7CBF3F' : '#C0392B', boxShadow: config ? '0 0 6px #7CBF3F' : 'none' }} />

          {/* Bouton Pin */}
          <button
            onClick={togglePin}
            title={pinned ? 'Désépingler' : 'Épingler — toujours au-dessus'}
            style={{
              background: pinned ? 'rgba(124,191,63,0.2)' : 'rgba(255,255,255,0.08)',
              border: pinned ? '1px solid rgba(124,191,63,0.4)' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 200ms',
              color: pinned ? '#7CBF3F' : 'rgba(255,255,255,0.5)',
            }}
          >
            📌
          </button>
        </div>
      </div>

      {/* Corps */}
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>

        {/* Plugin actif — paramètres */}
        {plugin ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Format badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 9,
                fontWeight: 800,
                color: '#7CBF3F',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                background: 'rgba(124,191,63,0.12)',
                padding: '2px 8px',
                borderRadius: 4,
              }}>
                {plugin.format}
              </span>
              {plugin.loading && (
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Analyse...
                </span>
              )}
            </div>

            {/* Loader */}
            {plugin.loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 20, height: 20,
                  border: '2px solid rgba(124,191,63,0.2)',
                  borderTopColor: '#7CBF3F',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              </div>
            )}

            {/* Paramètres */}
            {!plugin.loading && plugin.hasData && plugin.parameters.map((param, i) => (
              <div key={param.name} style={{
                padding: '10px 12px',
                background: cardBg,
                borderRadius: 10,
                border: `1px solid ${cardBorder}`,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 6,
                  background: 'rgba(124,191,63,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 800,
                  color: '#7CBF3F', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textColor, marginBottom: 3 }}>
                    {param.name}
                  </div>
                  <div style={{ fontSize: 11, color: mutedColor, lineHeight: 1.4 }}>
                    {param.shortExplanation}
                  </div>
                  {param.tips && (
                    <div style={{ marginTop: 4, fontSize: 11, color: '#7CBF3F', fontStyle: 'italic', opacity: 0.85 }}>
                      💡 {param.tips}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pas de fiche */}
            {!plugin.loading && !plugin.hasData && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 12, color: mutedColor, marginBottom: 12, lineHeight: 1.5 }}>
                  Pas encore de fiche pour ce plugin.
                </div>
                <button onClick={() => shellOpen(`${webUrl}/inventory`)} style={{
                  display: 'inline-block', padding: '7px 14px',
                  background: '#7CBF3F', borderRadius: 8,
                  fontSize: 11, color: '#1A1916', border: 'none', fontWeight: 700, cursor: 'pointer',
                }}>
                  Ajouter à l'inventaire →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Idle — pas de plugin ouvert */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Aucun plugin */}
            <div style={{
              padding: '16px',
              background: cardBg,
              borderRadius: 12,
              border: `1px solid ${cardBorder}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🎛️</div>
              <div style={{ fontSize: 12, color: mutedColor, lineHeight: 1.5 }}>
                Ouvre un plugin dans ton DAW<br />pour voir ses paramètres clés ici.
              </div>
            </div>

            {/* Lien inventaire */}
            <button
              onClick={() => shellOpen(`${webUrl}/inventory`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: cardBg,
                borderRadius: 12,
                border: `1px solid ${cardBorder}`,
                padding: '12px 14px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'border-color 200ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,191,63,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = cardBorder)}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: textColor, marginBottom: 2 }}>
                  Mon inventaire
                </div>
                <div style={{ fontSize: 11, color: mutedColor }}>
                  Gérer et supprimer des plugins
                </div>
              </div>
              <span style={{ color: '#7CBF3F', fontSize: 16 }}>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Panneau suppressions en attente */}
      {config && (pendingCount > 0 || deletionResults.length > 0) && (
        <div style={{ padding: '0 14px 10px' }}>
          <div style={{
            background: pendingCount > 0 ? 'rgba(192,57,43,0.12)' : 'rgba(124,191,63,0.08)',
            border: `1px solid ${pendingCount > 0 ? 'rgba(192,57,43,0.3)' : 'rgba(124,191,63,0.2)'}`,
            borderRadius: 10,
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: pendingCount > 0 ? '#C0392B' : '#7CBF3F' }}>
                {pendingCount > 0 ? `🗑 ${pendingCount} suppression${pendingCount > 1 ? 's' : ''} en attente` : '✓ Suppressions traitées'}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {pendingCount > 0 && (
                  <>
                    <button
                      onClick={handleCancelAll}
                      style={{
                        background: 'none', border: `1px solid ${cardBorder}`, borderRadius: 6,
                        padding: '3px 8px', color: mutedColor, fontFamily: 'DM Mono, monospace',
                        fontSize: 9, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}
                    >
                      Tout annuler
                    </button>
                    <button
                      onClick={handleForceDeletion}
                      disabled={deletionRunning}
                      style={{
                        background: '#C0392B', border: 'none', borderRadius: 6,
                        padding: '3px 8px', color: 'white', fontFamily: 'DM Mono, monospace',
                        fontSize: 9, cursor: deletionRunning ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase', letterSpacing: '0.06em', opacity: deletionRunning ? 0.6 : 1,
                      }}
                    >
                      {deletionRunning ? '...' : 'Supprimer maintenant'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {deletionResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {deletionResults.map((r, i) => (
                  <div key={i} style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: r.success ? '#7CBF3F' : '#C0392B',
                    padding: '3px 0',
                    borderTop: i > 0 ? `1px solid ${cardBorder}` : 'none',
                    position: 'relative',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ flex: 1 }}>{r.success ? '✓' : '✗'} {r.plugin_name}</span>
                      {!r.success && (
                        <button
                          onClick={() => handleCancelOne(r.id)}
                          style={{ background: 'none', border: 'none', padding: '0 4px', color: mutedColor, cursor: 'pointer', fontSize: 8, textTransform: 'uppercase' }}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                    {!r.success && r.error && (
                      <div style={{ opacity: 0.7, marginTop: 1, wordBreak: 'break-all', paddingRight: 40 }}>
                        {r.error === 'ADMIN_REQUIRED'
                          ? 'Ce plugin est dans C:\\Program Files\\ — fais clic droit sur PluginBase dans le tray → "Exécuter en tant qu\'administrateur"'
                          : r.error
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug — titres de fenêtres */}
      <div style={{ padding: '0 14px 10px' }}>
        <button
          onClick={async () => { setDebugOpen(o => !o); if (!debugOpen) await refreshDebug() }}
          style={{
            width: '100%', background: 'none', border: `1px dashed ${cardBorder}`,
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', fontSize: 9, color: mutedColor,
            textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between',
          }}
        >
          <span>🔍 Fenêtres détectées</span>
          <span>{debugOpen ? '▲' : '▼'}</span>
        </button>

        {debugOpen && (
          <div style={{
            marginTop: 6,
            background: pinned ? 'rgba(0,0,0,0.4)' : '#1A1916',
            borderRadius: 8,
            padding: '8px 10px',
          }}>
            {/* Résultat détection */}
            <div style={{
              marginBottom: 8,
              padding: '6px 8px',
              background: debugDetected ? 'rgba(124,191,63,0.15)' : 'rgba(192,57,43,0.12)',
              borderRadius: 6,
              border: `1px solid ${debugDetected ? 'rgba(124,191,63,0.3)' : 'rgba(192,57,43,0.2)'}`,
            }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: debugDetected ? '#7CBF3F' : '#C0392B', marginBottom: debugDetected ? 3 : 0 }}>
                {debugDetected ? `✓ Détecté : ${debugDetected.plugin_name}` : '✗ Aucun plugin détecté'}
              </div>
              {debugDetected && (
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>
                  [{debugDetected.format}] {debugDetected.raw_title}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {debugTitles.length} fenêtres
              </span>
              <button onClick={refreshDebug} style={{
                background: 'rgba(124,191,63,0.2)', border: 'none', borderRadius: 4,
                padding: '2px 8px', color: '#7CBF3F', fontFamily: 'DM Mono, monospace',
                fontSize: 9, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                ↻ Actualiser
              </button>
            </div>

            <div style={{ maxHeight: 140, overflowY: 'auto' }}>
              {debugTitles.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
                  Aucune fenêtre trouvée
                </div>
              ) : debugTitles.map((t, i) => {
                const isDetected = debugDetected?.raw_title === t
                const isPlugin = t.toLowerCase().includes('vst') || t.toLowerCase().includes('clap') || t.toLowerCase().includes('fx:')
                return (
                  <div key={i} style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: isDetected ? '#7CBF3F' : isPlugin ? 'rgba(124,191,63,0.6)' : 'rgba(255,255,255,0.3)',
                    padding: '2px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    wordBreak: 'break-all',
                    fontWeight: isDetected ? 800 : 'normal',
                  }}>
                    {isDetected ? '→ ' : ''}{t}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: `1px solid ${cardBorder}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {pinned ? '📌 Épinglé' : 'Non épinglé'}
        </span>
        <button
          onClick={onLogout}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, fontFamily: 'DM Mono, monospace',
            color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: 0, transition: 'color 200ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C0392B')}
          onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}
        >
          Déconnexion
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(124,191,63,0.3); border-radius: 2px; }
      `}</style>
    </div>
  )
}

      {/* Debug — titres de fenêtres */}
      <div style={{ padding: '0 14px 10px' }}>
        <button
          onClick={async () => { setDebugOpen(o => !o); if (!debugOpen) await refreshDebug() }}
          style={{
            width: '100%', background: 'none', border: `1px dashed ${cardBorder}`,
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', fontSize: 9, color: mutedColor,
            textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between',
          }}
        >
          <span>🔍 Fenêtres détectées</span>
          <span>{debugOpen ? '▲' : '▼'}</span>
        </button>

        {debugOpen && (
          <div style={{
            marginTop: 6,
            background: pinned ? 'rgba(0,0,0,0.4)' : '#1A1916',
            borderRadius: 8,
            padding: '8px 10px',
          }}>
            {/* Résultat détection */}
            <div style={{
              marginBottom: 8,
              padding: '6px 8px',
              background: debugDetected ? 'rgba(124,191,63,0.15)' : 'rgba(192,57,43,0.12)',
              borderRadius: 6,
              border: `1px solid ${debugDetected ? 'rgba(124,191,63,0.3)' : 'rgba(192,57,43,0.2)'}`,
            }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: debugDetected ? '#7CBF3F' : '#C0392B', marginBottom: debugDetected ? 3 : 0 }}>
                {debugDetected ? `✓ Détecté : ${debugDetected.plugin_name}` : '✗ Aucun plugin détecté'}
              </div>
              {debugDetected && (
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>
                  [{debugDetected.format}] {debugDetected.raw_title}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {debugTitles.length} fenêtres
              </span>
              <button onClick={refreshDebug} style={{
                background: 'rgba(124,191,63,0.2)', border: 'none', borderRadius: 4,
                padding: '2px 8px', color: '#7CBF3F', fontFamily: 'DM Mono, monospace',
                fontSize: 9, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                ↻ Actualiser
              </button>
            </div>

            <div style={{ maxHeight: 140, overflowY: 'auto' }}>
              {debugTitles.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
                  Aucune fenêtre trouvée
                </div>
              ) : debugTitles.map((t, i) => {
                const isDetected = debugDetected?.raw_title === t
                const isPlugin = t.toLowerCase().includes('vst') || t.toLowerCase().includes('clap') || t.toLowerCase().includes('fx:')
                return (
                  <div key={i} style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: isDetected ? '#7CBF3F' : isPlugin ? 'rgba(124,191,63,0.6)' : 'rgba(255,255,255,0.3)',
                    padding: '2px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    wordBreak: 'break-all',
                    fontWeight: isDetected ? 800 : 'normal',
                  }}>
                    {isDetected ? '→ ' : ''}{t}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: `1px solid ${cardBorder}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {pinned ? '📌 Épinglé' : 'Non épinglé'}
        </span>
        <button
          onClick={onLogout}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, fontFamily: 'DM Mono, monospace',
            color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: 0, transition: 'color 200ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C0392B')}
          onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}
        >
          Déconnexion
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(124,191,63,0.3); border-radius: 2px; }
      `}</style>
    </div>
  )
}
