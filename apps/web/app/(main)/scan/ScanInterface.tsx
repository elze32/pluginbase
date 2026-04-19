'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderSearch, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { normalizePlugin, PluginFormat, resolveKnownPlugin } from '../../../lib/plugin-normalizer';
import { openDirectoryPicker } from '../../../lib/plugin-scanner';
import { useInventoryStore, buildItemId, InventoryItem } from '../../../stores/inventory-store';
import { useOnboardingStore } from '../../../stores/onboarding-store';
import { useSessionLogStore } from '../../../stores/session-log-store';
import { useUnrecognizedStore } from '../../../stores/unrecognized-store';
import { logger } from '../../../lib/logger';

type ScanStatus = 'idle' | 'scanning' | 'completed' | 'unsupported' | 'error';

export function ScanInterface() {
  const router = useRouter();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanInsights, setScanInsights] = useState<string[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const { items, setItems, reset } = useInventoryStore();
  const { markFirstScanDone } = useOnboardingStore();
  const log = useSessionLogStore(s => s.log);
  const recordUnrecognized = useUnrecognizedStore(s => s.record);

  useEffect(() => {
    const compatible = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
    if (!compatible) {
      setStatus('unsupported');
      log({ type: 'scan_browser_unsupported', userAgent: navigator.userAgent });
    }
  }, [log]);

  const calculateInsights = (plugins: Omit<InventoryItem, 'status' | 'favorite' | 'personalNote' | 'customTags'>[]): string[] => {
    const insights: string[] = [];

    // 1. Doublons multi-format
    const nameMap = new Map<string, Set<string>>();
    plugins.forEach(p => {
      const normalizedName = p.displayName.toLowerCase();
      if (!nameMap.has(normalizedName)) {
        nameMap.set(normalizedName, new Set());
      }
      nameMap.get(normalizedName)!.add(p.format);
    });

    let duplicateCount = 0;
    nameMap.forEach((formats) => {
      if (formats.size > 1) duplicateCount++;
    });

    if (duplicateCount > 0) {
      insights.push(`Vous avez ${duplicateCount} plugin${duplicateCount > 1 ? 's' : ''} disponible${duplicateCount > 1 ? 's' : ''} en plusieurs formats.`);
    }

    // 2. Catégorie surreprésentée
    const categoryMap = new Map<string, number>();
    plugins.forEach(p => {
      if (p.category) {
        categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
      }
    });

    let topCategory = '';
    let maxCount = 0;
    categoryMap.forEach((count, cat) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    });

    const categoryTranslations: Record<string, string> = {
      'Synth': 'synthétiseurs',
      'Sampler': 'samplers',
      'EQ': 'égaliseurs',
      'Compressor': 'compresseurs',
      'Reverb': 'reverbs',
      'Delay': 'delays',
      'Saturation': 'saturateurs',
      'Limiter': 'limiteurs',
      'Analyzer': 'analyseurs',
      'Creative': 'outils créatifs',
      'Vocal': 'outils vocaux',
      'Modulation': 'effets de modulation',
      'Utility': 'utilitaires',
      'Mastering': 'outils de mastering'
    };

    if (maxCount >= 3) {
      insights.push(`Vous avez ${maxCount} ${categoryTranslations[topCategory] || topCategory} dans votre inventaire.`);
    }

    if (plugins.length > 100) {
      insights.push(`Vous avez ${plugins.length} plugins. Combien en utilisez-vous vraiment ?`);
    }

    return insights.slice(0, 3);
  };

  const scanDirectory = async () => {
    try {
      log({ type: 'scan_attempted' });
      const outcome = await openDirectoryPicker();

      if (outcome.status === 'cancelled' || outcome.status === 'blocked_by_browser') {
        setFailedAttempts(prev => prev + 1);
        if (outcome.status === 'cancelled') log({ type: 'scan_cancelled' });
        setStatus('idle');
        return;
      }

      if (outcome.status === 'unknown_error') {
        console.error(outcome.error);
        setStatus('error');
        setErrorMessage("Une erreur inconnue est survenue lors de l'ouverture du dossier.");
        return;
      }

      const dirHandle = outcome.dirHandle;
      setStatus('scanning');
      setErrorMessage(null);

      const detectedPlugins: Omit<InventoryItem, 'status' | 'favorite' | 'personalNote' | 'customTags'>[] = [];
      let recognizedCount = 0;

      async function processHandle(handle: FileSystemHandle) {
        const name = handle.name;
        let format: PluginFormat | null = null;

        if (name.endsWith('.vst3')) format = 'VST3';
        else if (name.endsWith('.component')) format = 'AU';
        else if (name.endsWith('.clap')) format = 'CLAP';
        else if (name.endsWith('.aaxplugin')) format = 'AAX';

        if (format) {
          const isKnown = resolveKnownPlugin(name) !== null;
          if (isKnown) recognizedCount++;
          else recordUnrecognized(name, format);

          const normalized = normalizePlugin(name, format);
          const id = buildItemId(name, format);
          
          if (!detectedPlugins.find(p => p.id === id)) {
            detectedPlugins.push({
              id,
              nameRaw: normalized.nameRaw,
              format: normalized.format,
              brand: normalized.brand,
              displayName: normalized.displayName,
              category: normalized.category
            });
          }
          return;
        }

        if (handle.kind === 'directory') {
          const dirHandle = handle as FileSystemDirectoryHandle;
          for await (const entry of dirHandle.values()) {
            await processHandle(entry);
          }
        }
      }

      for await (const entry of dirHandle.values()) {
        await processHandle(entry);
      }

      if (detectedPlugins.length === 0) {
        setStatus('idle');
        setErrorMessage("Aucun plugin détecté. Assurez-vous de scanner votre dossier VST3 ou AU.");
        return;
      }

      log({ 
        type: 'scan_succeeded', 
        pluginsFound: detectedPlugins.length,
        recognizedCount 
      });

      const isFirstScan = items.length === 0;
      setItems(detectedPlugins);
      setScanInsights(calculateInsights(detectedPlugins));
      setFailedAttempts(0); // Reset suite au succès
      setStatus('completed');
      
      if (isFirstScan) {
        markFirstScanDone();
      }
      
      // Redirection automatique après 1.5s pour laisser le temps de voir le succès
      setTimeout(() => {
        router.push('/inventaire');
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        log({ type: 'scan_cancelled' });
        setStatus('idle');
        return;
      }
      logger.error(err);
      setStatus('error');
      setErrorMessage("Une erreur est survenue lors du scan. Veuillez réessayer.");
    }
  };

  // Utilisé pour réinitialiser l'inventaire local depuis les outils de debug ou une future action UI.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReset = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser tout votre inventaire ? Cette action est irréversible.")) {
      reset();
      setStatus('idle');
    }
  };

  if (status === 'unsupported') {
    return (
      <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border)] p-12 shadow-md text-center">
        <div className="mx-auto w-16 h-16 bg-[var(--status-doublon-bg)] rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-[var(--status-doublon)]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Navigateur non compatible</h2>
        <p className="text-[var(--text-secondary)] font-body max-w-md mx-auto mb-8">
          Utilisez un navigateur moderne (Chrome, Edge, Brave) pour scanner vos plugins.
        </p>
        <button disabled className="px-6 py-3 bg-[var(--bg-sunken)] text-[var(--text-muted)] rounded-[6px] font-body text-sm opacity-50 cursor-not-allowed mx-auto">
          Importer un fichier (Bientôt)
        </button>
      </div>
    );
  }

  if (status === 'scanning') {
    return (
      <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border)] p-12 shadow-md space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-[var(--bg-sunken)] rounded-[6px]"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-[var(--bg-sunken)] rounded-[10px]"></div>)}
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-[var(--bg-sunken)] rounded-[10px]"></div>)}
        </div>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border)] p-12 shadow-md text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-[var(--accent-light)] rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} className="text-[var(--accent)]" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Scan terminé !</h2>
        <p className="text-[var(--text-secondary)] font-body max-w-md mx-auto">
          Votre inventaire a été mis à jour avec succès. Redirection vers votre collection...
        </p>
        <div className="flex items-center justify-center gap-2 text-[var(--accent)] font-mono text-sm">
          <RefreshCw size={16} className="animate-spin" /> Préparation de la vue...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="bg-[var(--status-doublon-bg)] border border-[var(--border)] p-4 rounded-[10px] flex items-center gap-3 text-[var(--status-doublon)]">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-body">{errorMessage}</p>
        </div>
      )}

      {failedAttempts >= 2 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--status-doublon)] border-opacity-30 rounded-[12px] p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-[var(--status-doublon-bg)] p-2 rounded-full">
              <AlertCircle size={20} className="text-[var(--status-doublon)]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Ton dossier VST3 est peut-être protégé par Windows
              </h3>
              <p className="text-sm font-body text-[var(--text-secondary)]">
                Chrome refuse l'accès à <code>Program Files</code> pour raisons de sécurité. Il y a des solutions simples.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pl-12">
            <Link 
              href="/aide/windows"
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2 rounded-[8px] text-xs font-display font-bold transition-all flex items-center gap-2"
            >
              Voir comment scanner tes plugins Windows
              <ArrowRight size={14} />
            </Link>
            <button 
              onClick={scanDirectory}
              className="bg-[var(--bg-elevated)] hover:bg-[var(--bg-sunken)] text-[var(--text-primary)] px-5 py-2 rounded-[8px] text-xs font-display font-bold transition-all"
            >
              Réessayer avec un autre dossier
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-[var(--accent-light)] border border-[var(--accent)] border-opacity-20 p-5 rounded-[12px] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <RefreshCw size={18} className="text-[var(--accent)]" />
            </div>
            <p className="text-sm font-body text-[var(--accent-text)]">
              Vous avez déjà un inventaire de <strong>{items.length} plugins</strong>. Un nouveau scan fusionnera proprement les nouvelles détections tout en conservant vos classifications.
            </p>
          </div>
          <Link href="/inventaire" className="whitespace-nowrap px-4 py-2 bg-white text-[var(--accent-text)] rounded-[6px] text-xs font-display font-bold border border-[var(--accent)] border-opacity-10 hover:shadow-sm transition-all flex items-center gap-2">
            Retour à l'inventaire <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {scanInsights.length > 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[12px] p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Premiers signaux de ta collection
            </h3>
          </div>
          {scanInsights.map((insight) => (
            <p key={insight} className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
              {insight}
            </p>
          ))}
        </div>
      )}

      <div className="bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border)] overflow-hidden shadow-lg">
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">Scanner mon dossier VST3 / AU</h2>
                <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                  Sélectionnez votre dossier de plugins. Vos classifications et favoris seront conservés.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-[var(--accent-light)] p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /></div>
                  <p className="text-sm font-body text-[var(--text-secondary)]"><strong>Conservation :</strong> les statuts déjà assignés ne sont pas écrasés.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-[var(--accent-light)] p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /></div>
                  <p className="text-sm font-body text-[var(--text-secondary)]"><strong>100% Local :</strong> vos données restent dans votre navigateur.</p>
                </div>
              </div>

              <div>
                <button onClick={scanDirectory} className="w-full md:w-auto px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[6px] font-display font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-sm mb-3">
                  <FolderSearch className="w-6 h-6" /> Choisir mon dossier
                </button>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    Dossier VST3 : dans ton dossier utilisateur, pas dans Program Files
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    Problème ? → <Link href="/aide/windows" className="underline hover:text-[var(--text-primary)] transition-colors">Guide Windows</Link>
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-mono bg-[var(--bg-base)] px-2 py-1 rounded">
                  <Info className="w-3 h-3" /> Windows: Common Files/VST3
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-mono bg-[var(--bg-base)] px-2 py-1 rounded">
                  <Info className="w-3 h-3" /> macOS: /Library/Audio/Plug-Ins
                </div>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-[var(--accent-light)] blur-3xl opacity-30 rounded-full"></div>
              <div className="relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[20px] p-6 shadow-xl transform rotate-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-[10px] border border-[var(--border)] opacity-60">
                      <div className="w-10 h-10 bg-[var(--bg-sunken)] rounded-[6px] flex items-center justify-center"><Search className="w-5 h-5 text-[var(--text-muted)]" /></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-[var(--bg-sunken)] rounded-full"></div>
                        <div className="h-2 w-16 bg-[var(--bg-sunken)] rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
