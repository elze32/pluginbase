import { useMemo } from 'react';
import { useInventoryStore, PluginStatus } from '../stores/inventory-store';
import { useFiltersStore } from '../stores/filters-store';

export function useFilteredItems() {
  const items = useInventoryStore((state) => state.items);
  const filters = useFiltersStore();

  const result = useMemo(() => {
    // 1. Calcul des compteurs (basé sur l'inventaire complet)
    const counts = {
      statuses: {} as Record<PluginStatus, number>,
      categories: {} as Record<string, number>,
      formats: {} as Record<string, number>,
      favorites: 0
    };

    items.forEach(item => {
      counts.statuses[item.status] = (counts.statuses[item.status] || 0) + 1;
      if (item.category) {
        counts.categories[item.category] = (counts.categories[item.category] || 0) + 1;
      }
      counts.formats[item.format] = (counts.formats[item.format] || 0) + 1;
      if (item.favorite) counts.favorites++;
    });

    // 2. Filtrage
    const filteredItems = items.filter(item => {
      // Recherche
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const match = 
          item.displayName.toLowerCase().includes(s) ||
          item.nameRaw.toLowerCase().includes(s) ||
          (item.brand && item.brand.toLowerCase().includes(s));
        if (!match) return false;
      }

      // Statut
      if (filters.statuses.size > 0 && !filters.statuses.has(item.status)) {
        return false;
      }

      // Catégorie
      if (filters.categories.size > 0) {
        if (!item.category || !filters.categories.has(item.category)) {
          return false;
        }
      }

      // Format
      if (filters.formats.size > 0 && !filters.formats.has(item.format)) {
        return false;
      }

      // Favoris
      if (filters.favoritesOnly && !item.favorite) {
        return false;
      }

      return true;
    });

    return {
      items: filteredItems,
      totalCount: items.length,
      counts
    };
  }, [items, filters.search, filters.statuses, filters.categories, filters.formats, filters.favoritesOnly]);

  return result;
}
