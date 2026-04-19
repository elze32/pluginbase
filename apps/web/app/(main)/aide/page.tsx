'use client';

import React from 'react';
import { 
  MessageSquare, 
  Share2, 
  Eye, 
  Copy, 
  Trash2, 
  AlertCircle, 
  ExternalLink,
  Code,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useSessionLogStore } from '../../../stores/session-log-store';
import { useUnrecognizedStore } from '../../../stores/unrecognized-store';
import { useInventoryStore } from '../../../stores/inventory-store';
import { useOnboardingStore } from '../../../stores/onboarding-store';
import { useFiltersStore } from '../../../stores/filters-store';

export default function AidePage() {
  const router = useRouter();
  const sessionLog = useSessionLogStore();
  const unrecognizedStore = useUnrecognizedStore();
  const inventoryStore = useInventoryStore();
  const onboardingStore = useOnboardingStore();
  const filtersStore = useFiltersStore();

  const handleExportSummary = () => {
    const summary = {
      session: JSON.parse(sessionLog.export()),
      unrecognized: unrecognizedStore.items,
      totalPlugins: inventoryStore.items.length
    };
    const json = JSON.stringify(summary, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('Résumé copié dans le presse-papier !');
  };

  const handleCopyUnrecognized = () => {
    const text = unrecognizedStore.items
      .map(i => `${i.nameRaw} | ${i.format}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Liste des plugins non reconnus copiée !');
  };

  const handleFullReset = () => {
    inventoryStore.reset();
    filtersStore.reset();
    onboardingStore.reset();
    sessionLog.clear();
    unrecognizedStore.clear();
    toast.info('Tout a été effacé.');
    router.push('/');
  };

  const unrecognizedList = unrecognizedStore.items
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Centre d'aide & Feedback</h1>
        <p className="text-xl text-[var(--text-secondary)] font-body">
          Merci d'aider PluginBase à s'améliorer pendant cette phase de test.
        </p>
      </header>

      {/* Bloc proactif Windows */}
      <section className="bg-[var(--accent-light)] border border-[var(--accent)] border-opacity-30 rounded-[14px] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-[var(--accent)]" size={24} />
          <h2 className="font-display text-xl font-bold text-[var(--accent-text)]">Problème pour scanner ?</h2>
        </div>
        <p className="font-body text-[var(--accent-text)] opacity-90 leading-relaxed">
          Chrome bloque l'accès à <code>Program Files</code> sur Windows pour des raisons de sécurité. Si ton scan ne fonctionne pas, consulte le guide dédié pour trouver une solution en 2 minutes.
        </p>
        <Link 
          href="/aide/windows"
          className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-[10px] font-display font-bold transition-all"
        >
          Voir le guide Windows
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Section 1 - Feedback */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-[var(--accent)]" size={24} />
          <h2 className="font-display text-xl font-bold">Envoyer un retour</h2>
        </div>
        <p className="font-body text-[var(--text-secondary)] leading-relaxed">
          PluginBase est en phase de test. Ton retour compte énormément pour orienter les prochaines fonctionnalités.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a 
            href="https://tally.so/r/pluginbase-beta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-[10px] font-display font-bold transition-all"
          >
            Répondre au questionnaire (3 min)
            <ExternalLink size={16} />
          </a>
          <span className="text-sm font-body text-[var(--text-muted)]">
            Ou écris à <a href="mailto:feedback@pluginbase.fr" className="text-[var(--text-secondary)] hover:underline">feedback@pluginbase.fr</a>
          </span>
        </div>
      </section>

      {/* Section 2 - Partager session */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Share2 className="text-[var(--text-primary)]" size={24} />
          <h2 className="font-display text-xl font-bold">Partager ta session (optionnel)</h2>
        </div>
        <p className="font-body text-[var(--text-secondary)] leading-relaxed">
          Si tu veux nous aider encore plus, tu peux nous envoyer un résumé anonyme de ta session. 
          Aucun nom de plugin, aucune note personnelle — juste ce que tu as fait sur le site.
        </p>
        <div className="flex gap-4">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="inline-flex items-center gap-2 bg-[var(--bg-elevated)] hover:bg-[var(--bg-sunken)] text-[var(--text-primary)] px-4 py-2.5 rounded-[8px] text-sm font-display font-bold transition-all">
                <Eye size={16} /> Voir ce qui serait partagé
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[80vh] bg-white rounded-[14px] p-8 shadow-2xl z-[120] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <Dialog.Title className="text-xl font-display font-bold mb-4">Aperçu de l'export anonyme</Dialog.Title>
                <div className="flex-1 overflow-auto bg-[var(--bg-base)] rounded-[8px] p-4 font-mono text-[11px] text-[var(--text-secondary)]">
                  <pre>{JSON.stringify({
                    session: JSON.parse(sessionLog.export()),
                    unrecognized: unrecognizedStore.items,
                    totalPlugins: inventoryStore.items.length
                  }, null, 2)}</pre>
                </div>
                <div className="mt-6 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="bg-[var(--text-primary)] text-white px-6 py-2 rounded-[8px] font-display font-bold text-sm">Fermer</button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <button 
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 bg-[var(--bg-elevated)] hover:bg-[var(--bg-sunken)] text-[var(--text-primary)] px-4 py-2.5 rounded-[8px] text-sm font-display font-bold transition-all"
          >
            <Copy size={16} /> Copier le résumé
          </button>
        </div>
        <p className="text-xs font-body text-[var(--text-muted)] italic">
          Ensuite, colle-le dans un mail à l'adresse ci-dessus. Jamais envoyé automatiquement.
        </p>
      </section>

      {/* Section 3 - Unrecognized */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="text-[var(--text-primary)]" size={24} />
            <h2 className="font-display text-xl font-bold">Plugins non reconnus</h2>
          </div>
          {unrecognizedList.length > 0 && (
            <button 
              onClick={handleCopyUnrecognized}
              className="inline-flex items-center gap-1.5 text-[var(--accent-text)] hover:underline text-xs font-display font-bold"
            >
              <Copy size={14} /> Copier la liste
            </button>
          )}
        </div>
        
        {unrecognizedList.length === 0 ? (
          <div className="bg-[var(--status-essential-bg)] border border-[var(--status-essential)] border-opacity-10 rounded-[10px] p-6 text-center">
            <p className="font-body text-[var(--status-essential)]">
              Tous tes plugins ont été reconnus — bravo, ta collection est mainstream. 🎯
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-body text-[var(--text-secondary)] text-sm">
              Ces plugins ne sont pas encore dans notre dictionnaire. Les partager nous aide à l'améliorer.
            </p>
            <div className="bg-[var(--bg-base)] rounded-[10px] border border-[var(--border)] overflow-hidden">
              <div className="max-h-60 overflow-y-auto divide-y divide-[var(--border)]">
                {unrecognizedList.map((item, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between group">
                    <span className="font-mono text-[12px] text-[var(--text-primary)] truncate max-w-[80%]">
                      {item.nameRaw}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase px-1.5 border border-[var(--border)] rounded">
                      {item.format}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 4 - Reset */}
      <section className="pt-8 border-t border-[var(--border)] flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-lg">Tu veux repartir de zéro ?</h3>
          <p className="text-sm font-body text-[var(--text-muted)]">Ceci effacera tout ton inventaire local, tes notes et tes logs.</p>
        </div>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="inline-flex items-center gap-2 text-[var(--status-doublon)] hover:bg-[var(--status-doublon-bg)] px-4 py-2 rounded-[8px] text-xs font-display font-bold transition-all">
              <Trash2 size={16} /> Tout effacer
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[14px] p-8 shadow-2xl z-[120] animate-in fade-in zoom-in-95 duration-200">
              <AlertDialog.Title className="text-xl font-display font-bold text-[var(--text-primary)] mb-4">
                Effacement total
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm font-body text-[var(--text-secondary)] mb-8 leading-relaxed">
                Es-tu certain ? Cette action supprimera définitivement ton inventaire, tes classifications, tes notes et ton historique de session.
              </AlertDialog.Description>
              <div className="flex justify-end gap-4">
                <AlertDialog.Cancel asChild>
                  <button className="px-6 py-2.5 bg-[var(--bg-base)] text-sm font-display font-bold text-[var(--text-primary)] rounded-[8px] hover:bg-[var(--border)] transition-colors">
                    Annuler
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button 
                    onClick={handleFullReset}
                    className="px-6 py-2.5 bg-[var(--status-doublon-bg)] text-sm font-display font-bold text-[var(--status-doublon)] rounded-[8px] hover:opacity-80 transition-colors"
                  >
                    Confirmer l'effacement
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </section>
    </div>
  );
}
