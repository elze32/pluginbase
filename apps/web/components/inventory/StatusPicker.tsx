import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { PluginStatus, useInventoryStore } from '../../stores/inventory-store';
import { StatusBadge } from '../ui/StatusBadge';

interface StatusPickerProps {
  id: string;
  currentStatus: PluginStatus;
}

const STATUS_OPTIONS: { value: PluginStatus; label: string }[] = [
  { value: 'ESSENTIAL', label: 'Essentiel' },
  { value: 'DOUBLON', label: 'Doublon' },
  { value: 'UNUSED', label: 'Inutilisé' },
  { value: 'TO_LEARN', label: 'À apprendre' },
  { value: 'TO_SELL', label: 'À vendre' },
  { value: 'TO_TEST', label: 'À tester' },
  { value: 'UNCLASSIFIED', label: 'Non classifié' },
];

export function StatusPicker({ id, currentStatus }: StatusPickerProps) {
  const setStatus = useInventoryStore((state) => state.setStatus);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div>
          <StatusBadge status={currentStatus} onClick={() => {}} />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-[var(--bg-surface)] rounded-[10px] p-1.5 shadow-lg border border-[var(--border)] z-[100] animate-in fade-in zoom-in-95 duration-150"
          sideOffset={5}
          align="end"
        >
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              className={`
                flex items-center px-3 py-2 text-xs font-body cursor-pointer outline-none rounded-[6px]
                ${currentStatus === option.value ? 'bg-[var(--accent-light)] text-[var(--accent-text)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'}
                transition-colors duration-150
              `}
              onSelect={() => setStatus(id, option.value)}
            >
              <div className="mr-3">
                <StatusBadge status={option.value} />
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
