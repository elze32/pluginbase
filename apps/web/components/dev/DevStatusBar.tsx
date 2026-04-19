'use client';

import React from 'react';
import Link from 'next/link';
import { useSessionLogStore } from '../../stores/session-log-store';
import { useInventoryStore } from '../../stores/inventory-store';
import { useUnrecognizedStore } from '../../stores/unrecognized-store';

export function DevStatusBar() {
  const eventsCount = useSessionLogStore((s) => s.events.length);
  const inventoryCount = useInventoryStore((s) => s.items.length);
  const unrecognizedCount = useUnrecognizedStore((s) => s.items.length);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex h-[28px] select-none items-center gap-6 border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 pointer-events-none">
      <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
          DEV MODE
        </span>
        <span>
          events: <strong className="text-[var(--text-primary)]">{eventsCount}</strong>
        </span>
        <span>
          inventory: <strong className="text-[var(--text-primary)]">{inventoryCount}</strong>
        </span>
        <span>
          unrecognized: <strong className="text-[var(--text-primary)]">{unrecognizedCount}</strong>
        </span>
      </div>

      <Link
        href="/aide"
        className="ml-auto pointer-events-auto text-[10px] font-mono text-[var(--accent)] hover:underline"
      >
        [voir /aide]
      </Link>
    </div>
  );
}
