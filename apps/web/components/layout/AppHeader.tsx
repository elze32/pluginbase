'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Search, Copy, ScanLine, HelpCircle } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventory-store';
import { detectMultiFormatDuplicates, detectFunctionalDuplicates } from '../../lib/duplicate-detector';

export function AppHeader() {
  const pathname = usePathname();
  const items = useInventoryStore((state) => state.items);

  const duplicateGroupsCount = useMemo(() => {
    if (items.length === 0) return 0;
    const multi = detectMultiFormatDuplicates(items);
    const functional = detectFunctionalDuplicates(items);
    return multi.length + functional.length;
  }, [items]);

  const navLinks = [
    { label: 'Inventaire', href: '/inventaire', icon: <Search size={16} /> },
    { 
      label: 'Doublons', 
      href: '/doublons', 
      icon: <Copy size={16} />,
      badge: duplicateGroupsCount > 0 ? duplicateGroupsCount : null 
    },
    { label: 'Insights', href: '/insights', icon: <Layers size={16} /> },
    { label: 'Scanner', href: '/scan', icon: <ScanLine size={16} /> },
  ];

  return (
    <header className="h-[64px] bg-[var(--bg-surface)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <Layers size={20} className="text-[var(--accent)] group-hover:scale-110 transition-transform" />
        <span className="font-display font-extrabold text-[18px] text-[var(--text-primary)]">
          PluginBase
        </span>
      </Link>

      <nav className="flex items-center gap-1 md:gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative flex items-center gap-2 px-3 py-2 text-sm font-body font-medium transition-colors rounded-md hover:bg-[var(--bg-base)]
                ${isActive ? 'text-[var(--text-primary)] bg-[var(--bg-base)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
              `}
            >
              <span className="hidden sm:inline-block">{link.icon}</span>
              {link.label}
              {link.badge !== null && (
                <span className="bg-[var(--status-doublon-bg)] text-[var(--status-doublon)] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {link.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[var(--accent)] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <Link 
          href="/aide" 
          className={`
            flex items-center gap-2 text-xs font-mono font-medium transition-colors
            ${pathname === '/aide' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}
          `}
        >
          <HelpCircle size={14} />
          <span className="hidden md:inline">Aide</span>
        </Link>
      </div>
    </header>
  );
}
