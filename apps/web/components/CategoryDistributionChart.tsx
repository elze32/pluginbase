'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InventoryItem } from '../stores/inventory-store';
import { CATEGORY_KNOWLEDGE } from '../lib/category-knowledge';

export default function CategoryDistributionChart({ items }: { items: InventoryItem[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(it => {
      const key = (it.category || 'GENERIC').toUpperCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({ key, label: (CATEGORY_KNOWLEDGE[key] || CATEGORY_KNOWLEDGE.GENERIC).label, value })).sort((a,b) => b.value - a.value);
  }, [items]);

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <XAxis type="number" />
          <YAxis dataKey="label" type="category" width={160} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--accent)">
            {data.map((entry, index) => {
              const key = entry.key;
              const meta = CATEGORY_KNOWLEDGE[key] || CATEGORY_KNOWLEDGE.GENERIC;
              const color = entry.value > meta.warningThreshold ? 'var(--status-doublon)' : 'var(--accent)';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
