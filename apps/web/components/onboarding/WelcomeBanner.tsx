'use client';

import React, { useMemo } from 'react';
import { X, Copy, Star, Layers, Zap } from 'lucide-react';
import Link from 'next/link';
import { useOnboardingStore } from '../../stores/onboarding-store';
import { useInventoryStore } from '../../stores/inventory-store';
import { useFiltersStore } from '../../stores/filters-store';
import { detectMultiFormatDuplicates, detectFunctionalDuplicates } from '../../lib/duplicate-detector';

export function WelcomeBanner() {
  const { hasCompletedFirstScan, hasSeenWelcome, dismissWelcome } = useOnboardingStore();
  const { items } = useInventoryStore();
  const { toggleStatus, reset: resetFilters } = useFiltersStore();

  const stats = useMemo(() => {
    if (items.length === 0) return { total: 0, duplicateGroups: 0, categoriesCount: 0 };
    
    const multi = detectMultiFormatDuplicates(items);
    const functional = detectFunctionalDuplicates(items);
    
    const categories = new Set(items.map(i => i.category).filter(Boolean));
    
    return {
      total: items.length,
      duplicateGroups: multi.length + functional.length,
      categoriesCount: categories.size
    };
  }, [items]);

  if (!hasCompletedFirstScan || hasSeenWelcome) return null;

  const handleAction = (callback?: () => void) => {
    if (callback) callback();
    dismissWelcome();
  };

  const actions = [
    {
      id: 'duplicates',
      title: 'Tes doublons',
      icon: <Copy className="text-[var(--status-doublon)]" size={20} />,
      label: `${stats.duplicateGroups} groupes détectés`,
      sublabel: 'Regarde les redondances évidentes',
      href: '/doublons',
      show: stats.duplicateGroups > 0
    },
    {
      id: 'essentials',
      title: 'Tes essentiels',
      icon: <Star className="text-[var(--accent)]" size={20} />,
      label: 'Marque tes incontournables',
      sublabel: 'Tes 5-10 plugins indispensables',
      onClick: () => {
        resetFilters();
        toggleStatus('UNCLASSIFIED');
        window.scrollTo({ top: 400, behavior: 'smooth' });
      },
      show: true
    },
    {
      id: 'categories',
      title: 'Par catégorie',
      icon: <Layers className="text-[var(--text-primary)]" size={20} />,
      label: `Explore tes ${stats.categoriesCount} catégories`,
      sublabel: 'Compresseurs, synthés, reverbs...',
      onClick: () => {
        // Juste dismiss, l'utilisateur verra la sidebar
      },
      show: stats.categoriesCount > 0
    }
  ];

  return (
    <div className="relative bg-[var(--accent-light)] border border-[var(--accent)] border-opacity-30 rounded-[12px] p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <button 
        onClick={dismissWelcome}
        className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
      >
        <X size={18} className="text-[var(--accent-text)]" />
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Zap size={20} className="text-[var(--accent)] fill-[var(--accent)]" />
        <h2 className="font-display text-2xl font-bold text-[var(--accent-text)]">
          Bienvenue — ton inventaire est prêt.
        </h2>
      </div>
      
      <p className="font-body text-[16px] text-[var(--accent-text)] opacity-90 mb-8">
        On a détecté <strong>{stats.total} plugins</strong> dans ta collection. Voici trois choses à explorer maintenant :
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.filter(a => a.show).map((action) => {
          const content = (
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-sm">
                {action.icon}
              </div>
              <div>
                <h4 className="font-display font-bold text-[15px] text-[var(--text-primary)] mb-0.5">
                  {action.title}
                </h4>
                <p className="text-[13px] font-medium text-[var(--accent-text)] mb-1">
                  {action.label}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] font-body">
                  {action.sublabel}
                </p>
              </div>
            </div>
          );

          if (action.href) {
            return (
              <Link 
                key={action.id} 
                href={action.href}
                onClick={() => handleAction()}
                className="bg-[var(--bg-surface)] p-5 rounded-[10px] border border-transparent hover:border-[var(--accent)] hover:shadow-md transition-all group"
              >
                {content}
              </Link>
            );
          }

          return (
            <button 
              key={action.id}
              onClick={() => handleAction(action.onClick)}
              className="text-left bg-[var(--bg-surface)] p-5 rounded-[10px] border border-transparent hover:border-[var(--accent)] hover:shadow-md transition-all group cursor-pointer"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
