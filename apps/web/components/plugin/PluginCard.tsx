'use client'

import { Star, MoreHorizontal, Trash2, StickyNote, Info } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { api } from '@/lib/api'
import type { PluginInstallation, PluginStatus, UserPluginState } from '@pluginbase/types'

const ALL_STATUSES: PluginStatus[] = ['ESSENTIAL', 'UNUSED', 'DOUBLON', 'TO_LEARN', 'TO_SELL', 'TO_TEST', 'UNCLASSIFIED']

interface PluginCardProps {
  plugin: PluginInstallation
  onUpdate: (updated: PluginInstallation) => void
  onDelete: (id: string) => void
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export function PluginCard({ plugin, onUpdate, onDelete, selected, onSelect }: PluginCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [loadingFav, setLoadingFav] = useState(false)
  const [imageError, setImageError] = useState(false)

  const status = plugin.state?.status ?? 'UNCLASSIFIED'
  const isFav = plugin.state?.favorite ?? false
  
  const category = plugin.category ?? plugin.master?.category ?? null
  const brand = plugin.brandRaw ?? 'Marque inconnue'

  // Construction du chemin de l'image officielle (fallback sur un placeholder si pas de master)
  // On utilise le normalizedPluginName pour matcher le fichier dans /public/plugins/
  const imageUrl = `/plugins/${plugin.normalizedPluginName}.png`
  const resolvedImageUrl = imageError
    ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNFOEU2RTAiLz48cGF0aCBkPSJNMjAgMTBMMTIgMjhIMjhMMjAgMTBaIiBmaWxsPSIjQThBNDlFIi8+PC9zdmc+'
    : imageUrl

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLoadingFav(true)
    try {
      const res = await api.patch<{ data: UserPluginState }>(`/api/v1/plugins/${plugin.id}/state`, { favorite: !isFav })
      onUpdate({ ...plugin, state: res.data })
    } finally {
      setLoadingFav(false)
    }
  }

  async function handleStatus(e: React.MouseEvent, newStatus: PluginStatus) {
    e.preventDefault()
    e.stopPropagation()
    setStatusMenuOpen(false)
    try {
      const res = await api.patch<{ data: UserPluginState }>(`/api/v1/plugins/${plugin.id}/state`, { status: newStatus })
      onUpdate({ ...plugin, state: res.data })
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Impossible de changer le statut')
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(false)
    if (!confirm(`Supprimer "${plugin.pluginNameRaw}" ?`)) return
    try {
      const res = await api.delete<{ data: { pendingDeletion?: boolean } }>(`/api/v1/plugins/${plugin.id}`)
      if (res.data?.pendingDeletion) {
        toast.success("Demande envoyée à l'application locale. Le fichier sera supprimé dans les 10 secondes.")
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
    <div 
      className={`group relative flex flex-col bg-bg-surface border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-border-strong ${selected ? 'ring-2 ring-accent border-transparent' : ''}`}
    >
      {/* Sélection checkbox (overlay au hover ou si déjà sélectionné) */}
      {onSelect && (
        <div className={`absolute top-3 left-3 z-10 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <input
            type="checkbox"
            checked={selected ?? false}
            onChange={(e) => onSelect(plugin.id, e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-accent bg-white border-white shadow-sm rounded"
          />
        </div>
      )}

      {/* Image / Visuel */}
      <Link href={`/plugin/${plugin.id}`} className="relative aspect-[16/10] bg-bg-sunken overflow-hidden block">
        <Image
          src={resolvedImageUrl}
          alt={plugin.pluginNameRaw}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          unoptimized
        />
        
        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Info size={18} className="text-text-primary" />
           </div>
        </div>

        {/* Badge "Fiche" */}
        {plugin.master?.descriptionFr && (
          <div className="absolute bottom-2 right-2 bg-accent text-accent-text text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent-text animate-pulse" />
            FICHE FR
          </div>
        )}
      </Link>

      {/* Contenu */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <Link 
            href={`/plugin/${plugin.id}`}
            className="font-display font-bold text-sm text-text-primary hover:text-accent truncate transition-colors"
          >
            {plugin.pluginNameRaw}
          </Link>
          <button
            onClick={handleFavorite}
            disabled={loadingFav}
            className={`shrink-0 transition-colors ${isFav ? 'text-[#F5A623]' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <Star size={15} fill={isFav ? '#F5A623' : 'none'} />
          </button>
        </div>

        <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-3 truncate">
          {brand} {category ? `· ${category}` : ''}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          {/* Badge statut cliquable */}
          <div className="relative">
            <button 
              onClick={(e) => { e.preventDefault(); setStatusMenuOpen(!statusMenuOpen) }} 
              className="block transition-transform active:scale-95"
            >
              <StatusBadge status={status} />
            </button>
            {statusMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={(e) => { e.preventDefault(); setStatusMenuOpen(false) }} />
                <div className="absolute left-0 bottom-full mb-2 bg-bg-surface border border-border rounded-lg shadow-lg min-w-[160px] z-30 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => handleStatus(e, s)}
                      className={`flex items-center w-full px-3 py-2 text-left transition-colors ${s === status ? 'bg-bg-elevated' : 'hover:bg-bg-base'}`}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Menu actions */}
          <div className="relative">
            <button
              onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}
              className="p-1.5 text-text-muted hover:text-text-secondary hover:bg-bg-elevated rounded-md transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={(e) => { e.preventDefault(); setMenuOpen(false) }} />
                <div className="absolute right-0 bottom-full mb-2 bg-bg-surface border border-border rounded-lg shadow-lg min-w-[150px] z-30 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <Link
                    href={`/plugin/${plugin.id}`}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-body text-text-secondary hover:bg-bg-elevated transition-colors border-b border-border"
                  >
                    <Info size={13} /> Voir les détails
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); /* Logic for note would go here or via detail */ }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-body text-text-secondary hover:bg-bg-elevated transition-colors"
                  >
                    <StickyNote size={13} /> {plugin.state?.personalNote ? 'Modifier la note' : 'Ajouter une note'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-body text-status-doublon hover:bg-status-doublon-bg transition-colors border-t border-border"
                  >
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
