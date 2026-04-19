'use client'

import { useState } from 'react'
import { Info, RotateCw } from 'lucide-react'
import type { PluginAnnotation } from '@pluginbase/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface AnnotatedScreenshotProps {
  screenshotUrl: string
  annotations: PluginAnnotation[]
  pluginName: string
  onReanalyze: () => void
  isReanalyzing: boolean
}

export function AnnotatedScreenshot({
  screenshotUrl,
  annotations,
  pluginName,
  onReanalyze,
  isReanalyzing,
}: AnnotatedScreenshotProps) {
  const [active, setActive] = useState<PluginAnnotation | null>(null)

  const fullUrl = screenshotUrl.startsWith('http') ? screenshotUrl : `${API_BASE}${screenshotUrl}`

  const handleClick = (ann: PluginAnnotation) => {
    setActive(active?.id === ann.id ? null : ann)
  }

  return (
    <div className="space-y-4">
      {/* Barre d'actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-muted">
            {annotations.length} contrôles identifiés
          </span>
        </div>
        <button
          onClick={onReanalyze}
          disabled={isReanalyzing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-elevated/50 text-text-secondary text-xs font-bold hover:bg-bg-elevated hover:text-text-primary transition-all disabled:opacity-50"
        >
          <RotateCw size={12} className={isReanalyzing ? 'animate-spin' : ''} />
          {isReanalyzing ? 'Analyse...' : 'Mettre à jour'}
        </button>
      </div>

      {/* Conteneur image + points */}
      <div
        className="relative inline-block w-full rounded-2xl overflow-hidden border border-border bg-black/5 shadow-inner cursor-crosshair"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null)
        }}
      >
        {/* Image principale */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullUrl}
          alt={pluginName}
          className="w-full h-auto block object-contain max-h-[70vh]"
          onClick={() => setActive(null)}
        />

        {/* Overlay pour les points — doit couvrir exactement l'image */}
        <div className="absolute inset-0 pointer-events-none">
          {annotations.map((ann, i) => (
            <button
              key={ann.id}
              onClick={(e) => {
                e.stopPropagation()
                handleClick(ann)
              }}
              className={`absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xl flex items-center justify-center font-mono text-[10px] font-black transition-all z-10 outline-none pointer-events-auto
                ${active?.id === ann.id 
                  ? 'bg-text-primary text-white scale-125 z-20' 
                  : 'bg-accent text-white hover:scale-110'}`}
              style={{
                left: `${ann.x}%`,
                top: `${ann.y}%`,
              }}
            >
              {i + 1}
              {/* Anneau pulsant sur les points inactifs */}
              {active?.id !== ann.id && (
                <span className="absolute inset-[-4px] rounded-full border-2 border-accent/40 animate-ping opacity-20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Bulle d'information flottante */}
        {active && (
          <div
            className="absolute bg-white/95 backdrop-blur-md border border-black/10 rounded-2xl p-4 shadow-2xl z-30 pointer-events-none transition-all duration-300 animate-in zoom-in-95 fade-in max-w-[240px]"
            style={{
              left: `${active.x > 70 ? active.x - 25 : active.x + 5}%`,
              top: `${active.y > 65 ? active.y - 25 : active.y + 5}%`,
              transform: 'translate(0, 0)'
            }}
          >
            <div className="font-mono text-[9px] font-black text-accent uppercase tracking-widest mb-1.5">
              {active.type || 'CONTRÔLE'}
            </div>
            <h4 className="font-display text-[15px] font-bold text-text-primary leading-tight mb-2">
              {active.label}
            </h4>
            <p className="font-body text-[12.5px] text-text-secondary leading-relaxed italic">
              {active.short || active.explanation || 'Aucune description disponible.'}
            </p>
            
            {/* Petit indicateur directionnel (triangle) */}
            <div className={`absolute w-3 h-3 bg-white/95 border-l border-t border-black/10 rotate-45 
              ${active.y > 65 ? 'bottom-[-7px] left-4 border-l-0 border-t-0 border-r border-b' : 'top-[-7px] left-4'}`} 
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 py-2">
        <p className="text-[11px] text-text-muted font-body italic flex items-center gap-1.5">
          <Info size={12} /> Cliquez sur un numéro pour voir les détails d'un paramètre.
        </p>
      </div>
    </div>
  )
}
