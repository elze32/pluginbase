'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, ListFilter } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventory-store';
import { useFilteredItems } from '../../../hooks/useFilteredItems';
import { FilterSidebar } from '../../../components/inventory/FilterSidebar';
import { InventoryList } from '../../../components/inventory/InventoryList';
import { InventoryStats } from '../../../components/inventory/InventoryStats';
import { WelcomeBanner } from '../../../components/onboarding/WelcomeBanner';

type SortOption = 'FAVORITES' | 'AZ' | 'ZA' | 'BRAND' | 'CATEGORY';

export default function InventairePage() {
  const router = useRouter();
  const { items: allItems } = useInventoryStore();
  const { items: filteredItems, totalCount } = useFilteredItems();
  const [sortBy, setSortOption] = useState<SortOption>('FAVORITES');

  // Redirection si inventaire vide
  useEffect(() => {
    // On attend un peu que zustand s'hydrate depuis le localStorage
    const timer = setTimeout(() => {
      if (allItems.length === 0) {
        router.push('/scan');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [allItems, router]);

  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    switch (sortBy) {
      case 'FAVORITES':
        return list.sort((a, b) => {
          if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
          return a.displayName.localeCompare(b.displayName);
        });
      case 'AZ':
        return list.sort((a, b) => a.displayName.localeCompare(b.displayName));
      case 'ZA':
        return list.sort((a, b) => b.displayName.localeCompare(a.displayName));
      case 'BRAND':
        return list.sort((a, b) => (a.brand || 'ZZZ').localeCompare(b.brand || 'ZZZ'));
      case 'CATEGORY':
        return list.sort((a, b) => (a.category || 'ZZZ').localeCompare(b.category || 'ZZZ'));
      default:
        return list;
    }
  }, [filteredItems, sortBy]);

  if (allItems.length === 0) return null; // Sera redirigé

  return (
    <div className="flex gap-8 relative min-h-[calc(100vh-160px)]">
      <FilterSidebar />
      
      <div className="flex-1 min-w-0">
        <header className="mb-8">
          <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] mb-2">
            Inventaire
          </h1>
          <p className="text-[var(--text-secondary)] font-body">
            {totalCount} plugins dans votre collection personnelle.
          </p>
        </header>

        <WelcomeBanner />
        <InventoryStats />

        <div className="flex items-center justify-between mb-6 bg-[var(--bg-surface)] p-4 rounded-[10px] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm font-body text-[var(--text-secondary)]">
            <ListFilter size={16} />
            <span className="font-bold text-[var(--text-primary)]">{filteredItems.length}</span>
            <span>/</span>
            <span>{totalCount} plugins affichés</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Trier par</span>
            <Select.Root value={sortBy} onValueChange={(v) => setSortOption(v as SortOption)}>
              <Select.Trigger className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-[var(--border)] rounded-[6px] text-xs font-body hover:border-[var(--accent)] transition-colors outline-none min-w-[140px]">
                <Select.Value />
                <Select.Icon><ChevronDown size={14} /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white border border-[var(--border)] rounded-[8px] shadow-lg p-1 z-[100]">
                  <Select.Viewport>
                    {[
                      { value: 'FAVORITES', label: 'Favoris d\'abord' },
                      { value: 'AZ', label: 'A - Z' },
                      { value: 'ZA', label: 'Z - A' },
                      { value: 'BRAND', label: 'Marque' },
                      { value: 'CATEGORY', label: 'Catégorie' },
                    ].map((opt) => (
                      <Select.Item
                        key={opt.value}
                        value={opt.value}
                        className="px-3 py-2 text-xs font-body rounded-[4px] outline-none cursor-pointer hover:bg-[var(--bg-base)] data-[state=checked]:text-[var(--accent)] data-[state=checked]:font-bold"
                      >
                        <Select.ItemText>{opt.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>

        <InventoryList items={sortedItems} />
      </div>
    </div>
  );
}
