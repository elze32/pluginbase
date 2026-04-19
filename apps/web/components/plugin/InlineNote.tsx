'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { PluginInstallation, UserPluginState } from '@pluginbase/types'

interface InlineNoteProps {
  plugin: PluginInstallation
  onUpdate: (updated: PluginInstallation) => void
  onClose: () => void
}

export function InlineNote({ plugin, onUpdate, onClose }: InlineNoteProps) {
  const [text, setText] = useState(plugin.state?.personalNote ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await api.patch<{ data: UserPluginState }>(`/api/v1/plugins/${plugin.id}/state`, {
        personalNote: text,
      })
      onUpdate({ ...plugin, state: res.data })
      toast.success('Note sauvegardée')
      onClose()
    } catch {
      toast.error('Impossible de sauvegarder la note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 16px 12px',
        background: 'var(--bg-elevated)',
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ta note sur ce plugin..."
        autoFocus
        rows={2}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.5,
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '4px 12px',
            borderRadius: 5,
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '4px 10px',
            borderRadius: 5,
            border: '1px solid var(--border)',
            background: 'transparent',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
