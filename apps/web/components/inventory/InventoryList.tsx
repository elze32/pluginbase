'use client';

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { InventoryItem } from '../../stores/inventory-store';
import { InventoryRow } from './InventoryRow';

interface InventoryListProps {
  items: InventoryItem[];
}

export function InventoryList({ items }: InventoryListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // TanStack Virtual déclenche un warning du React Compiler ; l'usage ici est volontaire et isolé.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  if (items.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-[var(--border)] rounded-[10px]">
        <p className="text-[var(--text-secondary)] font-body">Aucun plugin trouvé avec ces filtres.</p>
      </div>
    );
  }

  // Virtualisation pour les grandes listes (> 50)
  if (items.length > 50) {
    return (
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto border border-[var(--border)] rounded-[10px] bg-[var(--bg-surface)]"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <InventoryRow 
                item={items[virtualItem.index]} 
                isLast={virtualItem.index === items.length - 1} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Rendu simple pour les petites listes
  return (
    <div className="border border-[var(--border)] rounded-[10px] bg-[var(--bg-surface)] overflow-hidden">
      {items.map((item, index) => (
        <InventoryRow 
          key={item.id} 
          item={item} 
          isLast={index === items.length - 1} 
        />
      ))}
    </div>
  );
}
