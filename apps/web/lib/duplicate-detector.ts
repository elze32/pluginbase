import { InventoryItem } from '../stores/inventory-store';
import { normalizePluginPattern } from './plugin-normalizer';

export interface MultiFormatGroup {
  key: string;           // pattern normalisé
  displayName: string;   // nom lisible
  brand: string | null;
  items: InventoryItem[]; // ≥ 2 items
}

export interface FunctionalGroup {
  category: string;      // ex: "REVERB"
  categoryLabel: string; // ex: "Reverbs" (FR, pluriel)
  items: InventoryItem[]; // ≥ 2 items
}

export const CATEGORY_LABELS_FR: Record<string, string> = {
  'Synth': 'Synthés',
  'Sampler': 'Sampleurs',
  'EQ': 'EQ',
  'Compressor': 'Compresseurs',
  'Reverb': 'Reverbs',
  'Delay': 'Delays',
  'Saturation': 'Saturations',
  'Limiter': 'Limiteurs',
  'Analyzer': 'Analyseurs',
  'Creative': 'Effets créatifs',
  'Vocal': 'Effets vocaux',
  'Modulation': 'Modulations',
  'Utility': 'Utilitaires',
  'Mastering': 'Mastering'
};

/**
 * Détecte les plugins présents dans plusieurs formats (VST3, AU, etc.)
 */
export function detectMultiFormatDuplicates(items: InventoryItem[]): MultiFormatGroup[] {
  const groupsMap = new Map<string, InventoryItem[]>();

  items.forEach(item => {
    const key = normalizePluginPattern(item.nameRaw);
    const group = groupsMap.get(key) || [];
    group.push(item);
    groupsMap.set(key, group);
  });

  const groups: MultiFormatGroup[] = [];

  groupsMap.forEach((groupItems, key) => {
    if (groupItems.length >= 2) {
      // On prend le displayName et brand du premier item pour le groupe
      const first = groupItems[0];
      groups.push({
        key,
        displayName: first.displayName,
        brand: first.brand,
        items: groupItems
      });
    }
  });

  // Trier par taille de groupe décroissante
  return groups.sort((a, b) => b.items.length - a.items.length);
}

/**
 * Détecte les plugins occupant la même fonction (même catégorie)
 */
export function detectFunctionalDuplicates(items: InventoryItem[]): FunctionalGroup[] {
  const groupsMap = new Map<string, InventoryItem[]>();

  items.forEach(item => {
    if (item.category) {
      const group = groupsMap.get(item.category) || [];
      group.push(item);
      groupsMap.set(item.category, group);
    }
  });

  const groups: FunctionalGroup[] = [];

  groupsMap.forEach((groupItems, category) => {
    if (groupItems.length >= 2) {
      groups.push({
        category,
        categoryLabel: CATEGORY_LABELS_FR[category] || category,
        items: groupItems
      });
    }
  });

  // Trier par taille de groupe décroissante
  return groups.sort((a, b) => b.items.length - a.items.length);
}
