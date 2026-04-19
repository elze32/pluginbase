import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { OverlayPanel } from './components/OverlayPanel'
import { LoginPanel } from './components/LoginPanel'
import { ControlPanel } from './components/ControlPanel'

// URL de l'API — en prod, pointer vers l'URL publique
// @ts-ignore — vite types not included in overlay tsconfig
const API_URL: string = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3001'
// URL de l'app web — utilisée pour les liens "Détails" et "Ajouter"
// @ts-ignore
const WEB_URL: string = (import.meta as any).env?.VITE_WEB_URL ?? 'http://localhost:3000'

// Label de la fenêtre Tauri courante
const WINDOW_LABEL: string = appWindow.label

interface Config {
  token: string
  api_url: string
}

interface KeyParam {
  name: string
  shortExplanation: string
  tips: string
}

interface PluginData {
  pluginName: string
  format: string
  parameters: KeyParam[]
  hasData: boolean
}

export default function App() {
  // undefined = chargement, null = pas de config, Config = connecté
  const [config, setConfig] = useState<Config | null | undefined>(undefined)
  const [currentPlugin, setCurrentPlugin] = useState<PluginData | null>(null)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  // ── Vérifie la config au démarrage ────────────────────────────────
  useEffect(() => {
    invoke<Config | null>('get_config').then((cfg) => setConfig(cfg ?? null))
  }, [])

  // ── Affiche la fenêtre login si pas connecté ───────────────────────
  useEffect(() => {
    if (config === null) {
      appWindow.show().catch(() => {})
    }
  }, [config])

  // ── Détection de plugin (fenêtre overlay uniquement) ──────────────
  useEffect(() => {
    if (!config || WINDOW_LABEL !== 'overlay') return

    const unlisten = listen<{ plugin_name: string; format: string }>('plugin-detected', async (event) => {
      const { plugin_name: pluginName, format } = event.payload
      setLoading(true)
      setVisible(true)

      try {
        const res = await fetch(`${API_URL}/api/v1/guides/search/${encodeURIComponent(pluginName)}`, {
          headers: { Authorization: `Bearer ${config.token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setCurrentPlugin({
            pluginName,
            format,
            parameters: (data.keyParams ?? []).map((p: any) => ({
              name: p.name,
              shortExplanation: p.role,
              tips: p.tip,
            })),
            hasData: true,
          })
        } else {
          setCurrentPlugin({ pluginName, format, parameters: [], hasData: false })
        }
      } catch {
        setCurrentPlugin({ pluginName, format, parameters: [], hasData: false })
      } finally {
        setLoading(false)
      }
    })

    return () => { unlisten.then((f) => f()) }
  }, [config])

  useEffect(() => {
    if (!config || WINDOW_LABEL !== 'overlay') return

    const unlisten = listen('plugin-closed', () => {
      setTimeout(() => {
        setVisible(false)
        setCurrentPlugin(null)
      }, 3000)
    })

    return () => { unlisten.then((f) => f()) }
  }, [config])

  // ── Login email + mot de passe ─────────────────────────────────────
  async function handleLogin(email: string, password: string): Promise<string | null> {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'Connexion échouée'

      const cfg: Config = { token: data.data.token, api_url: API_URL }
      await invoke('save_config', { token: cfg.token, apiUrl: cfg.api_url })
      setConfig(cfg)
      return null
    } catch {
      return 'Impossible de joindre le serveur'
    }
  }

  // ── Login rapide par token ─────────────────────────────────────────
  async function handleLoginWithToken(token: string): Promise<string | null> {
    try {
      const res = await fetch(`${API_URL}/api/v1/plugins?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return 'Token invalide ou expiré'

      const cfg: Config = { token, api_url: API_URL }
      await invoke('save_config', { token: cfg.token, apiUrl: cfg.api_url })
      setConfig(cfg)
      return null
    } catch {
      return 'Impossible de joindre le serveur'
    }
  }

  // ── Déconnexion ────────────────────────────────────────────────────
  async function handleLogout() {
    await invoke('clear_config')
    setConfig(null)
    setVisible(false)
    setCurrentPlugin(null)
  }

  // ── Chargement initial ─────────────────────────────────────────────
  if (config === undefined) return null

  // ── Fenêtre de contrôle ────────────────────────────────────────────
  if (WINDOW_LABEL === 'control') {
    if (config === null) {
      return <LoginPanel onLogin={handleLogin} onLoginWithToken={handleLoginWithToken} />
    }
    return (
      <ControlPanel
        config={config}
        webUrl={WEB_URL}
        apiUrl={API_URL}
        onLogout={handleLogout}
      />
    )
  }

  // ── Fenêtre overlay ────────────────────────────────────────────────
  // Pas connecté → login
  if (config === null) {
    return <LoginPanel onLogin={handleLogin} onLoginWithToken={handleLoginWithToken} />
  }

  // Connecté mais masqué
  if (!visible) return null

  return (
    <OverlayPanel
      pluginName={currentPlugin?.pluginName ?? 'Détection...'}
      format={currentPlugin?.format ?? ''}
      parameters={currentPlugin?.parameters ?? []}
      hasData={currentPlugin?.hasData ?? false}
      loading={loading}
      webUrl={WEB_URL}
      onClose={() => setVisible(false)}
      onLogout={handleLogout}
    />
  )
}
