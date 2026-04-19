'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Library, ScanLine, Settings, LogOut, Star, Copy, Moon, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/qualify', label: 'Tri Rapide', icon: Zap, highlight: true },
  { href: '/inventory', label: 'Inventaire', icon: Library },
  { href: '/scanner', label: 'Scanner', icon: ScanLine },
]

const viewItems = [
  { href: '/views/essentiels', label: 'Essentiels', icon: Star },
  { href: '/views/doublons', label: 'Doublons', icon: Copy },
  { href: '/views/inutilises', label: 'Inutilisés', icon: Moon },
]

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  highlight,
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  highlight?: boolean
}) {
  if (highlight && !active) {
    return (
      <Link
        href={href}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px', borderRadius: 6, textDecoration: 'none',
          fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600,
          background: '#EDF6E2', color: '#3A6B10', transition: 'all 150ms ease-out',
        }}
      >
        <Icon size={15} color="#7CBF3F" />
        {label}
      </Link>
    )
  }
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 10px',
        borderRadius: 6,
        textDecoration: 'none',
        fontSize: 13,
        fontFamily: 'var(--font-body)',
        fontWeight: active ? 500 : 400,
        background: active ? '#EDF6E2' : 'transparent',
        color: active ? '#3A6B10' : 'var(--text-secondary)',
        transition: 'all 150ms ease-out',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--text-secondary)'
      }}
    >
      <Icon size={15} color={active ? '#3A6B10' : undefined} />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const user = useAuthStore((s) => s.user)

  async function handleLogout() {
    try {
      await api.post('/api/v1/auth/logout', {})
    } catch {
      // ignore
    }
    clearAuth()
    router.push('/login')
  }

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: 'var(--bg-elevated)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo wordmark */}
      <div
        style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
        >
          <span style={{ color: '#1A1916' }}>Plugin</span>
          <span style={{ color: '#7CBF3F' }}>Base</span>
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {navItems.map(({ href, label, icon: Icon, highlight }) => (
          <NavLink key={href} href={href} label={label} icon={Icon} active={isActive(href)} highlight={highlight} />
        ))}

        {/* Vues rapides */}
        <div style={{ marginTop: 20, marginBottom: 2, padding: '0 10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#A8A49E',
              margin: 0,
              fontWeight: 500,
            }}
          >
            Vues rapides
          </p>
        </div>
        {viewItems.map(({ href, label, icon: Icon }) => (
          <NavLink key={href} href={href} label={label} icon={Icon} active={isActive(href)} />
        ))}
      </nav>

      {/* Bas — settings + user */}
      <div
        style={{
          borderTop: '1px solid rgba(26, 25, 22, 0.08)',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <NavLink href="/settings" label="Paramètres" icon={Settings} active={isActive('/settings')} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px 4px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 148,
            }}
          >
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: 4,
              borderRadius: 4,
              transition: 'color 150ms ease-out',
            }}
            title="Déconnexion"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-doublon)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
