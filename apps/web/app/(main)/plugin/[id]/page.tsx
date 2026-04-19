'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Trash2, 
  X, 
  Info,
  Save,
  CheckCircle2
} from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useInventoryStore } from '../../../../stores/inventory-store';
import { useSessionLogStore } from '../../../../stores/session-log-store';
import { StatusPicker } from '../../../../components/inventory/StatusPicker';
import { FavoriteButton } from '../../../../components/inventory/FavoriteButton';

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { items, setNote, addTag, removeTag, removeItem } = useInventoryStore();
  const log = useSessionLogStore(s => s.log);

  const itemId = decodeURIComponent(params.id as string);
  const item = items.find(i => i.id === itemId);
  const [newTag, setNewTag] = useState('');
  const [note, setLocalNote] = useState(item?.personalNote || '');

  useEffect(() => {
    log({ type: 'plugin_detail_opened' });
  }, [log]);

  // Persister la note au changement avec debounce
  useEffect(() => {
    if (!item) return;
    const timer = setTimeout(() => {
      if (note !== item.personalNote) {
        setNote(item.id, note);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [note, item, setNote]);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Plugin introuvable</h1>
        <Link href="/inventaire" className="text-[var(--accent)] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Retour à l'inventaire
        </Link>
      </div>
    );
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      addTag(item.id, newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/inventaire" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft size={14} /> Retour à l'inventaire
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] truncate">
            {item.displayName}
          </h1>
          <p className="font-mono text-sm text-[var(--text-secondary)] mt-1">
            {item.brand || 'Marque inconnue'} · {item.format}
          </p>
        </div>
        <div className="flex-shrink-0 pt-2">
          <FavoriteButton id={item.id} isFavorite={item.favorite} />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identification */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Info size={16} className="text-[var(--text-muted)]" />
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Identification</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Marque', value: item.brand || 'Non détectée' },
              { label: 'Format', value: item.format },
              { label: 'Fichier source', value: item.nameRaw, mono: true },
              { label: 'Catégorie', value: item.category || 'Non classé' },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-3 gap-4">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">{row.label}</span>
                <span className={`col-span-2 text-sm font-body text-[var(--text-primary)] ${row.mono ? 'font-mono text-[10px]' : ''}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Classification */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <CheckCircle2 size={16} className="text-[var(--accent)]" />
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Classification</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Statut actuel</span>
              <StatusPicker id={item.id} currentStatus={item.status} />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">Tags personnels</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {item.customTags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full text-xs font-body text-[var(--text-primary)]">
                    {tag}
                    <button onClick={() => removeTag(item.id, tag)} className="hover:text-[var(--status-doublon)]">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ajouter un tag..."
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-[6px] px-3 py-2 text-xs font-body focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Notes */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] p-6 space-y-4">
        <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">Note personnelle</label>
        <textarea
          value={note}
          onChange={e => setLocalNote(e.target.value.slice(0, 500))}
          placeholder="Pourquoi aimes-tu ce plugin ? Dans quels contextes l'utilises-tu ?"
          rows={5}
          className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-[10px] p-4 text-sm font-body text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
        />
        <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)]">
          <span>{note.length} / 500 caractères</span>
          {note !== item.personalNote && <span className="flex items-center gap-1 text-[var(--accent)]"><Save size={10} /> Enregistrement...</span>}
        </div>
      </section>

      {/* Actions */}
      <footer className="flex items-center justify-between pt-8">
        <Link 
          href="/inventaire" 
          className="px-6 py-2.5 bg-white border border-[var(--border-strong)] rounded-[8px] text-sm font-display font-bold text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors"
        >
          Retour à l'inventaire
        </Link>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--status-doublon)] transition-colors px-4 py-2">
              <Trash2 size={14} /> Supprimer de l'inventaire
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[14px] p-8 shadow-2xl z-[120] animate-in fade-in zoom-in-95 duration-200">
              <AlertDialog.Title className="text-xl font-display font-bold text-[var(--text-primary)] mb-4">
                Confirmer la suppression
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm font-body text-[var(--text-secondary)] mb-8 leading-relaxed">
                Voulez-vous vraiment retirer <strong>{item.displayName}</strong> de votre inventaire ? Cette action supprimera également vos notes et tags personnels.
              </AlertDialog.Description>
              <div className="flex justify-end gap-4">
                <AlertDialog.Cancel asChild>
                  <button className="px-6 py-2.5 bg-[var(--bg-base)] text-sm font-display font-bold text-[var(--text-primary)] rounded-[8px] hover:bg-[var(--border)] transition-colors">
                    Annuler
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button 
                    onClick={() => {
                      removeItem(item.id);
                      router.push('/inventaire');
                    }}
                    className="px-6 py-2.5 bg-[var(--status-doublon-bg)] text-sm font-display font-bold text-[var(--status-doublon)] rounded-[8px] hover:opacity-80 transition-colors"
                  >
                    Supprimer
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </footer>
    </div>
  );
}
