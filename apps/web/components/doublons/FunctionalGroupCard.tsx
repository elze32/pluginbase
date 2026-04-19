'use client';

import React, { useMemo } from 'react';
import { FunctionalGroup } from '../../lib/duplicate-detector';
import { StatusPicker } from '../inventory/StatusPicker';
import { FavoriteButton } from '../inventory/FavoriteButton';
import { Layers } from 'lucide-react';

interface FunctionalGroupCardProps {
  group: FunctionalGroup;
}

export function FunctionalGroupCard({ group }: FunctionalGroupCardProps) {
  const sortedGroupItems = useMemo(() => {
    return [...group.items].sort((a, b) => {
      // 1. Favoris d'abord
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      
      // 2. Par statut (ESSENTIAL > others > UNCLASSIFIED)
      const getStatusRank = (status: string) => {
        if (status === 'ESSENTIAL') return 0;
        if (status === 'UNCLASSIFIED') return 2;
        return 1;
      };
      
      const rankA = getStatusRank(a.status);
      const rankB = getStatusRank(b.status);
      
      if (rankA !== rankB) return rankA - rankB;
      
      // 3. Par displayName
      return a.displayName.localeCompare(b.displayName);
    });
  }, [group.items]);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-display font-bold text-lg text-[var(--text-primary)]">
            {group.categoryLabel}
          </h4>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--accent-light)] rounded-full text-[var(--accent-text)] font-mono text-[10px] uppercase tracking-widest font-bold">
          <Layers size={12} /> {group.items.length} plugins
        </div>
      </div>

      <div className="space-y-2">
        {sortedGroupItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[var(--bg-base)] rounded-[8px] transition-colors group/item border border-transparent hover:border-[var(--border)]">
            <div className="flex items-center gap-4 flex-1">
              <FavoriteButton id={item.id} isFavorite={item.favorite} />
              <div className="flex flex-col">
                <span className="font-display font-medium text-[15px] text-[var(--text-primary)] leading-tight">
                  {item.displayName}
                </span>
                <span className="text-[10px] font-body text-[var(--text-secondary)]">
                  {item.brand || 'Inconnu'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="hidden group-hover/item:inline-block font-mono text-[9px] text-[var(--text-muted)] uppercase px-1.5 border border-[var(--border)] rounded mr-2">
                 {item.format}
               </span>
               <StatusPicker id={item.id} currentStatus={item.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
