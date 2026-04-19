'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BookOpen, Zap, Sprout, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { PluginFiche } from '@pluginbase/types'

interface PluginFicheCardProps {
  fiche: PluginFiche
}

function SectionLabel({ children, icon: Icon }: { children: ReactNode, icon?: LucideIcon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon size={14} className="text-accent" />}
      <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-text-muted">
        {children}
      </span>
      <div className="flex-1 h-px bg-border ml-2" />
    </div>
  )
}

export function PluginFicheCard({ fiche }: PluginFicheCardProps) {
  const [parametersExpanded, setParametersExpanded] = useState(false)

  const visibleParams = parametersExpanded ? fiche.parameters : fiche.parameters.slice(0, 4)
  const hiddenCount = fiche.parameters.length - 4

  const generatedDate = new Date(fiche.generatedAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Description */}
      <section>
        <SectionLabel icon={BookOpen}>À propos</SectionLabel>
        <p className="font-body text-[15px] text-text-primary leading-relaxed">
          {fiche.description}
        </p>
      </section>

      {/* Cas d'usage */}
      {fiche.useCases.length > 0 && (
        <section>
          <SectionLabel>Scénarios d'utilisation</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fiche.useCases.map((uc, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-bg-elevated/50 border border-border rounded-xl transition-all hover:border-accent/30 group">
                <span className="font-mono text-[11px] text-accent font-bold bg-white w-6 h-6 flex items-center justify-center rounded-lg shadow-sm group-hover:bg-accent group-hover:text-white transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-body text-[13px] text-text-secondary leading-snug pt-0.5">
                  {uc}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Paramètres */}
      {fiche.parameters.length > 0 && (
        <section>
          <SectionLabel>Maîtrise de l'interface</SectionLabel>
          <div className="flex flex-col gap-3">
            {visibleParams.map((param, i) => (
              <div key={i} className="bg-bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-sm font-bold text-text-primary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {param.name}
                  </div>
                </div>
                <div className="font-body text-[13px] text-text-secondary leading-relaxed mb-3">
                  {param.shortExplanation}
                </div>
                <div className="font-body text-[12px] italic text-text-muted bg-bg-base p-2.5 rounded-lg flex items-start gap-2 border-l-2 border-accent/20">
                  <ArrowRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>{param.tips}</span>
                </div>
              </div>
            ))}
          </div>
          {fiche.parameters.length > 4 && (
            <button
              onClick={() => setParametersExpanded(e => !e)}
              className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 font-body text-xs text-text-muted hover:text-text-primary hover:bg-bg-elevated border border-border rounded-xl transition-all"
            >
              {parametersExpanded ? (
                <>
                  <ChevronUp size={14} /> Masquer les détails
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> + {hiddenCount} autres paramètres clés
                </>
              )}
            </button>
          )}
        </section>
      )}

      {/* Conseils & Techniques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fiche.beginnerTip && (
          <section className="bg-accent-light/30 border border-accent/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sprout size={16} className="text-accent" />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-accent-text">
                Conseil débutant
              </span>
            </div>
            <p className="font-body text-[13.5px] text-accent-text leading-relaxed font-medium">
              {fiche.beginnerTip}
            </p>
          </section>
        )}

        {fiche.proTip && (
          <section className="bg-text-primary rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-accent" />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/60">
                Technique pro
              </span>
            </div>
            <p className="font-body text-[13.5px] text-white/90 leading-relaxed font-medium">
              {fiche.proTip}
            </p>
          </section>
        )}
      </div>

      {/* Va bien avec + Alternatives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
        {fiche.pairsWellWith.length > 0 && (
          <section>
            <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-text-muted mb-3">
              Synergies idéales
            </div>
            <div className="flex flex-wrap gap-2">
              {fiche.pairsWellWith.map((name, i) => (
                <span key={i} className="font-mono text-[11px] px-2.5 py-1 bg-bg-elevated text-text-secondary border border-border rounded-md">
                  {name}
                </span>
              ))}
            </div>
          </section>
        )}

        {fiche.alternatives.length > 0 && (
          <section>
            <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-text-muted mb-3">
              Alternatives suggérées
            </div>
            <div className="flex flex-wrap gap-2">
              {fiche.alternatives.map((name, i) => (
                <span key={i} className="font-mono text-[11px] px-2.5 py-1 bg-bg-sunken text-text-muted border border-border rounded-md">
                  {name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-border" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
          Généré par PluginBase AI · {generatedDate}
        </span>
      </div>
    </div>
  )
}
