import { create } from 'zustand';
import { PluginStatus } from './inventory-store';
import { useSessionLogStore } from './session-log-store';

export interface FiltersState {
  search: string;
  statuses: Set<PluginStatus>;
  categories: Set<string>;
  formats: Set<string>;
  favoritesOnly: boolean;
  
  setSearch: (v: string) => void;
  toggleStatus: (s: PluginStatus) => void;
  toggleCategory: (c: string) => void;
  toggleFormat: (f: string) => void;
  setFavoritesOnly: (v: boolean) => void;
  reset: () => void;
  hasActiveFilters: () => boolean;
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  search: '',
  statuses: new Set<PluginStatus>(),
  categories: new Set<string>(),
  formats: new Set<string>(),
  favoritesOnly: false,

  setSearch: (v) => set({ search: v }),
  
  toggleStatus: (s) => set((state) => {
    useSessionLogStore.getState().log({ type: 'filter_used', filterKey: 'status' });
    const next = new Set(state.statuses);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    return { statuses: next };
  }),

  toggleCategory: (c) => set((state) => {
    useSessionLogStore.getState().log({ type: 'filter_used', filterKey: 'category' });
    const next = new Set(state.categories);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    return { categories: next };
  }),

  toggleFormat: (f) => set((state) => {
    useSessionLogStore.getState().log({ type: 'filter_used', filterKey: 'format' });
    const next = new Set(state.formats);
    if (next.has(f)) next.delete(f);
    else next.add(f);
    return { formats: next };
  }),

  setFavoritesOnly: (v) => {
    useSessionLogStore.getState().log({ type: 'filter_used', filterKey: 'favoritesOnly' });
    set({ favoritesOnly: v });
  },

  reset: () => set({
    search: '',
    statuses: new Set(),
    categories: new Set(),
    formats: new Set(),
    favoritesOnly: false
  }),

  hasActiveFilters: () => {
    const s = get();
    return s.search !== '' || s.statuses.size > 0 || s.categories.size > 0 || s.formats.size > 0 || s.favoritesOnly;
  }
}));
