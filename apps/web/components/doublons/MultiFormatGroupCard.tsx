'use client';

import React from 'react';
import { MultiFormatGroup } from '../../lib/duplicate-detector';
import { useInventoryStore } from '../../stores/inventory-store';
import { StatusPicker } from '../inventory/StatusPicker';
import { FavoriteButton } from '../inventory/FavoriteButton';
import { Copy } from 'lucide-react';

interface MultiFormatGroupCardProps {
  group: MultiFormatGroup;
}

export function MultiFormatGroupCard({ group }: MultiFormatGroupCardProps) {
  const setStatus = useInventoryStore((state) => state.setStatus);

  const handleMarkOthers = () => {
    // 1. Trouver le favori s'il existe
    const favorite = group.items.find(item => item.favorite);
    // 2. Sinon garder le premier
    const toKeep = favorite || group.items[0];

    // 3. Marquer tous les autres comme DOUBLON
    group.items.forEach(item => {
      if (item.id !== toKeep.id) {
        setStatus(item.id, 'DOUBLON');
      }
    });
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-display font-bold text-lg text-[var(--text-primary)]">
            {group.displayName}
          </h4>
          <p className="text-sm text-[var(--text-secondary)] font-body">
            {group.brand || 'Inconnu'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-sunken)] rounded-full text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-widest">
          <Copy size={12} /> {group.items.length} formats
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {group.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--bg-base)] rounded-[8px] group/item">
            <div className="flex items-center gap-3">
              <FavoriteButton id={item.id} isFavorite={item.favorite} />
              <span className="font-mono text-[11px] font-bold text-[var(--text-primary)] uppercase">
                {item.format}
              </span>
            </div>
            <StatusPicker id={item.id} currentStatus={item.status} />
          </div>
        ))}
      </div>

      <button
        onClick={handleMarkOthers}
        className="w-full py-2.5 bg-white border border-[var(--border-strong)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[6px] text-xs font-display font-bold transition-all"
      >
        Marquer les autres formats comme doublons
      </button>
    </div>
  );
}
