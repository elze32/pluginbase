'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  AlertCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function AideWindowsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <Link 
        href="/scan" 
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={14} /> Retour au scanner
      </Link>

      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">
          Scanner tes plugins sur Windows
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-body">
          Chrome protège certains dossiers système. Voici comment faire pour quand même scanner ta collection.
        </p>
      </header>

      {/* Section 1 - Le problème */}
      <section className="bg-[var(--bg-elevated)] rounded-[14px] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-[var(--status-doublon)]" size={24} />
          <h2 className="font-display text-xl font-bold">Pourquoi ça bloque ?</h2>
        </div>
        <p className="font-body text-[var(--text-secondary)] leading-relaxed">
          Chrome refuse l'accès à <code>C:\Program Files</code> et à quelques autres dossiers système pour des raisons de sécurité. C'est une protection du navigateur, pas un bug de PluginBase. Malheureusement, c'est là où la plupart des plugins VST3 s'installent par défaut.
        </p>
      </section>

      {/* Section 2 - Solutions */}
      <div className="space-y-8">
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Trois solutions simples</h2>

        {/* Solution 1 */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center font-display font-bold">1</span>
            <h3 className="font-display text-lg font-bold">Utilise ton dossier VST3 personnel</h3>
          </div>
          <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed">
            Certains DAW (Ableton, FL Studio, Bitwig) permettent de définir un dossier VST3 personnel que Windows et Chrome acceptent de lire.
          </p>
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Emplacements habituels :</p>
            <div className="bg-[var(--bg-base)] p-4 rounded-[8px] space-y-2">
              <code className="block text-[12px] font-mono text-[var(--text-primary)] truncate">C:\Users\[ton-nom]\Documents\VST3</code>
              <code className="block text-[12px] font-mono text-[var(--text-primary)] truncate">C:\Users\[ton-nom]\AppData\Local\Programs\Common\VST3</code>
            </div>
          </div>
          <p className="text-xs font-body text-[var(--text-muted)] italic">
            Si tu n'as pas encore ce type de dossier, passe à la solution 2.
          </p>
        </section>

        {/* Solution 2 */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center font-display font-bold">2</span>
            <h3 className="font-display text-lg font-bold">Copie temporaire sur le Bureau</h3>
          </div>
          <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed font-bold">
            La méthode qui marche à 100%, même si elle demande 2 minutes.
          </p>
          <ol className="space-y-3">
            {[
              "Ouvre l'Explorateur Windows et va dans C:\\Program Files\\Common Files\\VST3",
              "Sélectionne tout (Ctrl+A) et copie (Ctrl+C)",
              "Sur ton Bureau, crée un dossier nommé scan-pluginbase",
              "Colle dedans (Ctrl+V)",
              "Reviens ici, clique sur « Scanner », et choisis ce dossier scan-pluginbase",
              "Une fois le scan fait, supprime le dossier pour libérer l'espace"
            ].map((step, i) => (
              <li key={i} className="flex gap-4 text-sm font-body text-[var(--text-primary)]">
                <span className="flex-shrink-0 text-[var(--text-muted)] font-mono">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link 
              href="/scan"
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-[10px] font-display font-bold transition-all flex items-center gap-2"
            >
              Lancer le scan maintenant
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs font-body text-[var(--text-muted)] max-w-xs leading-relaxed">
              Cette copie ne modifie rien à tes plugins. C'est juste une copie temporaire que Chrome accepte de lire.
            </p>
          </div>
        </section>

        {/* Solution 3 */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[var(--bg-sunken)] text-[var(--text-muted)] flex items-center justify-center font-display font-bold">3</span>
            <h3 className="font-display text-lg font-bold text-[var(--text-muted)]">Attends le scanner natif</h3>
          </div>
          <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed">
            On prépare une mini-application à installer qui pourra scanner directement tes plugins, sans cette limitation du navigateur. Elle sera disponible dans les prochaines semaines.
          </p>
          <button 
            disabled
            className="inline-flex items-center gap-2 bg-[var(--bg-elevated)] text-[var(--text-muted)] px-6 py-3 rounded-[10px] font-display font-bold cursor-not-allowed opacity-60"
          >
            Bientôt disponible
          </button>
        </section>
      </div>

      {/* Autres OS */}
      <footer className="pt-12 border-t border-[var(--border)] space-y-4">
        <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Tu n'es pas sur Windows ?</h3>
        <p className="font-body text-sm text-[var(--text-secondary)]">
          Sur Mac, Linux, ou autre système, consulte ta page d'aide correspondante.
        </p>
        <div className="flex gap-4">
          <Link href="/aide/mac" className="text-[var(--accent)] hover:underline text-sm font-display font-bold flex items-center gap-1">
            Guide macOS <ChevronRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
