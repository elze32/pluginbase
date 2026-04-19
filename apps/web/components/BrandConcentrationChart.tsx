'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { InventoryItem } from '../stores/inventory-store';

const COLORS = ['#7CBF3F', '#6AAD30', '#F3C677', '#7C3AED', '#2563EB', '#C0392B', '#B07D2A', '#3A6B10', '#6B6760', '#EDF6E2'];

export default function BrandConcentrationChart({ items }: { items: InventoryItem[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(it => {
      const b = it.brand || 'Inconnu';
      counts[b] = (counts[b] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a,b) => b[1]-a[1]);
    const top = entries.slice(0,10).map(([name, value]) => ({ name, value }));
    const others = entries.slice(10).reduce((s,[,v]) => s+v,0);
    if (others > 0) top.push({ name: 'Autres', value: others });
    return top;
  }, [items]);

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
