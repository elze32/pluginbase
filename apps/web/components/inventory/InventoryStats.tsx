'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useInventoryStore } from '../../stores/inventory-store';
import { detectMultiFormatDuplicates, detectFunctionalDuplicates } from '../../lib/duplicate-detector';

interface StatCardProps {
  value: string | number;
  label: string;
  href?: string;
  isClickable?: boolean;
}

function StatCard({ value, label, href, isClickable }: StatCardProps) {
  const content = (
    <div
      className={`
        flex flex-col items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-center shadow-sm transition-all duration-200
        ${isClickable ? 'group cursor-pointer hover:border-[var(--accent)] hover:shadow-md' : ''}
      `}
    >
      <div
        className={`
          mb-2 font-display text-[32px] font-bold leading-none md:text-[36px]
          ${isClickable ? 'text-[var(--accent)] transition-transform group-hover:scale-110' : 'text-[var(--text-primary)]'}
        `}
      >
        {value}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)] md:text-[11px]">
        {label}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

export function InventoryStats() {
  const items = useInventoryStore((state) => state.items);

  const stats = useMemo(() => {
    const total = items.length;
    const essentials = items.filter((item) => item.status === 'ESSENTIAL').length;
    const markedDoublons = items.filter((item) => item.status === 'DOUBLON').length;
    const multiGroups = detectMultiFormatDuplicates(items);

    let extraMultiDetected = 0;
    multiGroups.forEach((group) => {
      const alreadyMarkedInGroup = group.items.filter((item) => item.status === 'DOUBLON').length;
      const detectableSurplus = group.items.length - 1;
      extraMultiDetected += Math.max(0, detectableSurplus - alreadyMarkedInGroup);
    });

    const totalDoublons = markedDoublons + extraMultiDetected;
    const classifiedCount = items.filter((item) => item.status !== 'UNCLASSIFIED').length;
    const classifiedPercent = total > 0 ? Math.round((classifiedCount / total) * 100) : 0;
    const functionalGroups = detectFunctionalDuplicates(items);
    const detectedGroupsCount = multiGroups.length + functionalGroups.length;

    return {
      total,
      essentials,
      totalDoublons,
      classifiedPercent,
      detectedGroupsCount,
    };
  }, [items]);

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
      <StatCard value={stats.total} label="Total" href="/insights" isClickable={true} />
      <StatCard value={stats.essentials} label="Essentiels" />
      <StatCard value={stats.totalDoublons} label="Doublons" />
      <StatCard value={`${stats.classifiedPercent}%`} label="Classifiés" />
      <StatCard
        value={stats.detectedGroupsCount}
        label="Groupes détectés"
        href="/doublons"
        isClickable={stats.detectedGroupsCount > 0}
      />
    </div>
  );
}
