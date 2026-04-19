'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useFiltersStore } from '../../stores/filters-store';
import { useFilteredItems } from '../../hooks/useFilteredItems';
import { PluginStatus } from '../../stores/inventory-store';

const STATUS_LABELS: Record<PluginStatus, string> = {
  ESSENTIAL: 'Essentiel',
  DOUBLON: 'Doublon',
  UNUSED: 'Inutilisé',
  TO_LEARN: 'À apprendre',
  TO_SELL: 'À vendre',
  TO_TEST: 'À tester',
  UNCLASSIFIED: 'Non classifié',
};

export function FilterSidebar() {
  const filters = useFiltersStore();
  const { counts } = useFilteredItems();
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      filters.setSearch(localSearch);
    }, 150);
    return () => clearTimeout(timer);
  }, [filters, localSearch]);

  const sortedCategories = Object.keys(counts.categories).sort();
  const sortedFormats = Object.keys(counts.formats).sort();

  return (
    <aside className="w-[220px] bg-[var(--bg-elevated)] border-r border-[var(--border)] h-[calc(100vh-64px)] sticky top-[64px] flex flex-col overflow-y-auto">
      {/* Recherche */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Chercher un plugin..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[6px] pl-9 pr-3 py-2 text-xs font-body focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Statuts */}
      <div className="p-4 border-b border-[var(--border)] space-y-3">
        <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Statut</h4>
        <div className="space-y-1">
          {(Object.keys(STATUS_LABELS) as PluginStatus[]).map((s) => (
            <label key={s} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.statuses.has(s)}
                  onChange={() => filters.toggleStatus(s)}
                  className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                <span className="text-xs font-body text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {STATUS_LABELS[s]}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {counts.statuses[s] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Catégories */}
      {sortedCategories.length > 0 && (
        <div className="p-4 border-b border-[var(--border)] space-y-3">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Catégorie</h4>
          <div className="space-y-1">
            {sortedCategories.map((c) => (
              <label key={c} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.has(c)}
                    onChange={() => filters.toggleCategory(c)}
                    className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[var(--accent)]"
                  />
                  <span className="text-xs font-body text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    <a href={`/categorie/${c.toLowerCase()}`} onClick={(e) => e.stopPropagation()} className="hover:underline">{c}</a>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {counts.categories[c]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Formats */}
      <div className="p-4 border-b border-[var(--border)] space-y-3">
        <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Format</h4>
        <div className="space-y-1">
          {sortedFormats.map((f) => (
            <label key={f} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.formats.has(f)}
                  onChange={() => filters.toggleFormat(f)}
                  className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                <span className="text-xs font-body text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors font-mono">
                  {f}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {counts.formats[f]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Favoris */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-body text-[var(--text-primary)]">Uniquement favoris</span>
          <Switch.Root
            checked={filters.favoritesOnly}
            onCheckedChange={filters.setFavoritesOnly}
            className="w-9 h-5 bg-[var(--bg-sunken)] rounded-full relative outline-none data-[state=checked]:bg-[var(--accent)] transition-colors"
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
          </Switch.Root>
        </div>
      </div>

      {/* Réinitialiser */}
      {filters.hasActiveFilters() && (
        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <button
            onClick={() => {
              filters.reset();
              setLocalSearch('');
            }}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--status-doublon)] transition-colors"
          >
            <X size={12} /> Réinitialiser les filtres
          </button>
        </div>
      )}
    </aside>
  );
}
