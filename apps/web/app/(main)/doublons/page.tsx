'use client';

import React, { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventory-store';
import { useSessionLogStore } from '../../../stores/session-log-store';
import { detectMultiFormatDuplicates, detectFunctionalDuplicates } from '../../../lib/duplicate-detector';
import { MultiFormatGroupCard } from '../../../components/doublons/MultiFormatGroupCard';
import { FunctionalGroupCard } from '../../../components/doublons/FunctionalGroupCard';

export default function DoublonsPage() {
  const items = useInventoryStore((state) => state.items);
  const log = useSessionLogStore(s => s.log);

  const { multiGroups, functionalGroups } = useMemo(() => {
    return {
      multiGroups: detectMultiFormatDuplicates(items),
      functionalGroups: detectFunctionalDuplicates(items)
    };
  }, [items]);

  useEffect(() => {
    log({ 
      type: 'duplicates_viewed', 
      multiFormat: multiGroups.length, 
      functional: functionalGroups.length 
    });
  }, [log, multiGroups.length, functionalGroups.length]);

  const totalGroups = multiGroups.length + functionalGroups.length;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[var(--bg-surface)] border border-[var(--border)] rounded-full flex items-center justify-center mb-8">
          <Layers size={32} className="text-[var(--text-muted)]" />
        </div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-4">Aucun inventaire détecté</h1>
        <p className="text-[var(--text-secondary)] font-body max-w-sm mb-8">
          Vous devez d'abord scanner vos dossiers de plugins pour que nous puissions analyser les doublons.
        </p>
        <Link 
          href="/scan" 
          className="px-8 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[8px] font-display font-bold flex items-center gap-2 transition-all"
        >
          Aller au scanner <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  if (totalGroups === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[var(--status-essential-bg)] border border-[var(--border)] rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 size={32} className="text-[var(--status-essential)]" />
        </div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-4">Bravo, aucun doublon !</h1>
        <p className="text-[var(--text-secondary)] font-body max-w-sm">
          Votre inventaire est parfaitement propre. Aucun doublon multi-format ou plugin similaire n'a été détecté.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] mb-4">
          Doublons détectés
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-body max-w-2xl">
          PluginBase a identifié des ressources redondantes. Optimisez votre workflow en isolant vos essentiels.
        </p>
      </header>

      {multiGroups.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline gap-4 border-b border-[var(--border)] pb-4">
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Doublons multi-format
            </h2>
            <span className="bg-[var(--status-doublon-bg)] text-[var(--status-doublon)] text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {multiGroups.length} groupes
            </span>
          </div>
          <p className="text-[var(--text-secondary)] font-body">
            Ces plugins sont installés dans plusieurs formats. Vous pouvez probablement désinstaller les formats que votre DAW n'utilise pas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {multiGroups.map((group) => (
              <MultiFormatGroupCard key={group.key} group={group} />
            ))}
          </div>
        </section>
      )}

      {functionalGroups.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline gap-4 border-b border-[var(--border)] pb-4">
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Plugins similaires
            </h2>
            <span className="bg-[var(--accent-light)] text-[var(--accent-text)] text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {functionalGroups.length} catégories
            </span>
          </div>
          <p className="text-[var(--text-secondary)] font-body">
            Ces plugins occupent un rôle similaire dans votre workflow. Lequel est vraiment votre essentiel ?
          </p>
          <div className="grid grid-cols-1 gap-8 pt-4">
            {functionalGroups.map((group) => (
              <FunctionalGroupCard key={group.category} group={group} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
