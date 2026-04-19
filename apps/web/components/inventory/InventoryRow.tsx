'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { StatusPicker } from './StatusPicker';
import { InventoryItem } from '../../stores/inventory-store';

interface InventoryRowProps {
  item: InventoryItem;
  isLast?: boolean;
}

export function InventoryRow({ item, isLast }: InventoryRowProps) {
  return (
    <div 
      className={`
        flex items-center h-[56px] px-4 gap-4 transition-colors duration-150
        hover:bg-[var(--bg-elevated)] group border-b border-[var(--border)]
        ${isLast ? 'border-b-0' : ''}
      `}
    >
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton id={item.id} isFavorite={item.favorite} />
      </div>

      <Link 
        href={`/plugin/${encodeURIComponent(item.id)}`}
        className="flex-1 flex items-center min-w-0 h-full py-2"
      >
        <div className="flex flex-col min-w-0 mr-4">
          <span className="font-display font-medium text-[15px] text-[var(--text-primary)] truncate">
            {item.displayName}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)] truncate">
            {item.brand || 'Inconnu'} · {item.format}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-6">
          {item.category && (
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase text-[var(--text-secondary)] bg-[var(--bg-sunken)] px-1.5 py-0.5 rounded-sm">
              {item.category}
            </span>
          )}
          
          <div onClick={(e) => e.preventDefault()}>
            <StatusPicker id={item.id} currentStatus={item.status} />
          </div>

          <ChevronRight 
            size={16} 
            className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" 
          />
        </div>
      </Link>
    </div>
  );
}
