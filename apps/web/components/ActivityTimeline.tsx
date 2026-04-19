'use client';

import React from 'react';
import { useSessionLogStore } from '../stores/session-log-store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ActivityTimeline() {
  const events = useSessionLogStore(s => s.events);
  const days = 7;
  const now = Date.now();
  const msDay = 24 * 60 * 60 * 1000;

  const buckets = Array.from({ length: days }, (_, i) => {
    const start = now - (days - 1 - i) * msDay;
    const end = start + msDay;
    const count = events.filter(e => e.at >= start && e.at < end).length;
    return { day: new Date(start).toLocaleDateString(), count };
  });

  const totalActions = buckets.reduce((s, b) => s + b.count, 0);

  if (events.length < 3) return null;

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={buckets} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="var(--accent)" />
        </BarChart>
      </ResponsiveContainer>
      <p className="font-mono text-[12px] text-[var(--text-secondary)] mt-3">Ces 7 derniers jours tu as fait <strong>{totalActions}</strong> actions sur ta collection.</p>
    </div>
  );
}
