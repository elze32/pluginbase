import { describe, it, expect } from 'vitest';
import { generateInsights } from '../insights-engine';
import { InventoryItem } from '../../stores/inventory-store';

function buildItems(count: number, category?: string, brand?: string): InventoryItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${category || 'item'}-${i}`,
    nameRaw: `${category || 'item'}-${i}`,
    format: 'VST3',
    brand: brand || `Brand${i % 3}`,
    displayName: `${category || 'item'} ${i}`,
    category: category || null,
    status: 'UNCLASSIFIED',
    favorite: false,
    customTags: [],
  }));
}

describe('generateInsights', () => {
  it('empty inventory => no insights', () => {
    expect(generateInsights([])).toEqual([]);
  });

  it('surcollection de compresseurs triggers critical', () => {
    const items = [...buildItems(60, 'COMPRESSOR')];
    const insights = generateInsights(items);
    expect(insights.some(i => i.severity === 'critical')).toBe(true);
  });

  it('brand dominance triggers notable', () => {
    const items = [...buildItems(50, 'SYNTH', 'BigBrand'), ...buildItems(10, 'REVERB', 'Other')];
    const insights = generateInsights(items);
    expect(insights.some(i => i.title.includes('BigBrand'))).toBe(true);
  });

  it('balanced collection returns positive', () => {
    const items = [...buildItems(6, 'SYNTH'), ...buildItems(4, 'SAMPLER'), ...buildItems(5, 'COMPRESSOR')];
    const insights = generateInsights(items);
    expect(insights.some(i => i.severity === 'positive')).toBe(true);
  });

  it('multiple triggers return ordered by severity', () => {
    const items = [...buildItems(60, 'COMPRESSOR'), ...buildItems(40, 'SYNTH'), ...buildItems(10, 'REVERB')];
    const insights = generateInsights(items);
    expect(insights.length > 0).toBe(true);
    expect(insights[0].severity === 'critical').toBe(true);
  });
});
