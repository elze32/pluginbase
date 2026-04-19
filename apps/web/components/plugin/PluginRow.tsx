'use client'

import { Star, MoreHorizontal, Trash2, StickyNote, RefreshCw, XCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { InlineNote } from '@/components/plugin/InlineNote'
import { api } from '@/lib/api'
import type { PluginInstallation, PluginStatus, UserPluginState } from '@pluginbase/types'

const ALL_STATUSES: PluginStatus[] = ['ESSENTIAL', 'UNUSED', 'DOUBLON', 'TO_LEARN', 'TO_SELL', 'TO_TEST', 'UNCLASSIFIED']

interface PluginRowProps {
  plugin: PluginInstallation
  onUpdate: (updated: PluginInstallation) => void
  onDelete: (id: string) => void
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export function PluginRow({ plugin, onUpdate, onDelete, selected, onSelect }: PluginRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [loadingFav, setLoadingFav] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const status = plugin.state?.status ?? 'UNCLASSIFIED'
  const isFav = plugin.state?.favorite ?? false
  const hasNote = !!plugin.state?.personalNote
  const isPending = plugin.pendingDeletion ?? false
  const hasError = Boolean(plugin.pendingDeletionError)

  const category = plugin.category ?? plugin.master?.category ?? null
  const metaParts = [
    plugin.brandRaw ?? null,
    plugin.format,
    category,
    plugin.version ?? null,
  ].filter(Boolean)
  const meta = metaParts.join(' · ')

  async function handleFavorite() {
    setLoadingFav(true)
    try {
      const res = await api.patch<{ data: UserPluginState }>(`/api/v1/plugins/${plugin.id}/state`, { favorite: !isFav })
      onUpdate({ ...plugin, state: res.data })
    } finally {
      setLoadingFav(false)
    }
  }

  async function handleStatus(newStatus: PluginStatus) {
    setStatusMenuOpen(false)
    try {
      const res = await api.patch<{ data: UserPluginState }>(`/api/v1/plugins/${plugin.id}/state`, { status: newStatus })
      onUpdate({ ...plugin, state: res.data })
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Impossible de changer le statut')
    }
  }

  async function handleDelete() {
    setMenuOpen(false)
    if (!confirm(`Supprimer "${plugin.pluginNameRaw}" ?`)) return

    try {
      const res = await api.delete<{ data: { pendingDeletion?: boolean } }>(`/api/v1/plugins/${plugin.id}`)
      if (res.data?.pendingDeletion) {
        toast.success("Demande de suppression physique envoyée à l'application locale.")
        onUpdate({ ...plugin, pendingDeletion: true })
      } else {
        onDelete(plugin.id)
        toast.success(`${plugin.pluginNameRaw} supprimé`)
      }
    } catch {
      toast.error('Impossible de supprimer ce plugin')
    }
  }

  return (
    <div className="group relative">
      <div
        className={`grid items-center gap-3 border-b border-border px-4 py-2.5 transition-all duration-150 ease-out hover:bg-bg-elevated ${
          selected ? 'bg-accent-light' : 'bg-bg-surface'
        } ${noteOpen ? 'border-b-0' : 'border-b'} ${isPending ? 'opacity-60 grayscale' : ''}`}
        style={{
          gridTemplateColumns: onSelect ? '28px 1fr auto auto auto' : '1fr auto auto auto',
        }}
      >
        {onSelect && (
          <input
            type="checkbox"
            disabled={isPending}
            checked={selected ?? false}
            onChange={(e) => onSelect(plugin.id, e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer accent-accent disabled:cursor-not-allowed"
          />
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/plugin/${plugin.id}`}
              className={`flex items-center gap-1.5 truncate font-display text-sm font-medium text-text-primary transition-colors hover:text-accent ${isPending ? 'pointer-events-none' : ''}`}
              title={plugin.pluginNameRaw}
            >
              {plugin.master?.descriptionFr && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" title="Fiche disponible" />
              )}
              {plugin.pluginNameRaw}
            </Link>
            {isPending && (
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-accent animate-pulse">
                <RefreshCw size={10} className="animate-spin" /> Suppression locale...
              </span>
            )}
            {hasError && (
              <span
                className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-status-doublon"
                title={plugin.pendingDeletionError ?? undefined}
              >
                <XCircle size={10} /> Erreur suppression
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            {meta && <p className="m-0 font-mono text-[11px] text-text-muted">{meta}</p>}
            {hasNote && !noteOpen && (
              <span className="font-mono text-[10px] italic text-text-muted">
                · {plugin.state!.personalNote!.slice(0, 40)}
                {plugin.state!.personalNote!.length > 40 ? '…' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            disabled={isPending}
            onClick={() => setStatusMenuOpen((open) => !open)}
            className={`block border-none bg-none p-0 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <StatusBadge status={status} />
          </button>
          {statusMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[160px] overflow-hidden rounded-lg border border-border bg-bg-surface shadow-md">
                {ALL_STATUSES.map((nextStatus) => (
                  <button
                    key={nextStatus}
                    onClick={() => handleStatus(nextStatus)}
                    className={`flex w-full cursor-pointer items-center border-none p-2 transition-colors ${
                      nextStatus === status ? 'bg-bg-elevated' : 'bg-transparent hover:bg-bg-base'
                    }`}
                  >
                    <StatusBadge status={nextStatus} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleFavorite}
          disabled={loadingFav || isPending}
          className={`flex items-center border-none bg-none p-1 transition-colors ${
            isFav ? 'text-[#F5A623]' : 'text-text-muted hover:text-text-secondary'
          } ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Star size={15} fill={isFav ? '#F5A623' : 'none'} />
        </button>

        <div className="relative">
          <button
            disabled={isPending}
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex items-center rounded border-none bg-none p-1 text-text-muted hover:text-text-secondary ${isPending ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[160px] overflow-hidden rounded-lg border border-border bg-bg-surface shadow-md animate-in zoom-in-95 fade-in duration-100">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setNoteOpen(true)
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-2 text-left font-body text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated"
                >
                  <StickyNote size={13} />
                  {hasNote ? 'Modifier la note' : 'Ajouter une note'}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full cursor-pointer items-center gap-2 border-none border-t border-border bg-transparent px-3 py-2 text-left font-body text-[13px] text-status-doublon transition-colors hover:bg-status-doublon-bg"
                >
                  <Trash2 size={13} />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {noteOpen && (
        <InlineNote plugin={plugin} onUpdate={onUpdate} onClose={() => setNoteOpen(false)} />
      )}
    </div>
  )
}
