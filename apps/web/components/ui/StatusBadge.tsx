import React from 'react';
import { PluginStatus } from '../../stores/inventory-store';

interface StatusBadgeProps {
  status: PluginStatus;
  onClick?: () => void;
}

const STATUS_CONFIG: Record<PluginStatus, { label: string; bg: string; text: string }> = {
  ESSENTIAL: { label: 'Essentiel', bg: 'var(--status-essential-bg)', text: 'var(--status-essential)' },
  DOUBLON: { label: 'Doublon', bg: 'var(--status-doublon-bg)', text: 'var(--status-doublon)' },
  UNUSED: { label: 'Inutilisé', bg: 'var(--status-sleep-bg)', text: 'var(--status-sleep)' },
  TO_LEARN: { label: 'À apprendre', bg: 'var(--status-learn-bg)', text: 'var(--status-learn)' },
  TO_SELL: { label: 'À vendre', bg: 'var(--status-sell-bg)', text: 'var(--status-sell)' },
  TO_TEST: { label: 'À tester', bg: 'var(--status-test-bg)', text: 'var(--status-test)' },
  UNCLASSIFIED: { label: 'Non classifié', bg: 'var(--bg-sunken)', text: 'var(--text-muted)' },
};

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      onClick={onClick}
      className={`
        inline-block px-2 py-0.5 rounded-[4px] 
        font-mono text-[11px] uppercase tracking-[0.06em]
        transition-all duration-150 ease-out
        ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 select-none' : ''}
      `}
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
}
