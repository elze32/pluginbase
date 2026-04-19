import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSessionLogStore } from './session-log-store';

export type PluginStatus = 
  | 'UNCLASSIFIED'
  | 'ESSENTIAL'
  | 'DOUBLON'
  | 'UNUSED'
  | 'TO_LEARN'
  | 'TO_SELL'
  | 'TO_TEST';

export interface InventoryItem {
  id: string;            // slug stable
  nameRaw: string;
  format: string;
  brand: string | null;
  displayName: string;
  category: string | null;
  status: PluginStatus;
  favorite: boolean;
  personalNote?: string;
  customTags: string[];
}

export function buildItemId(nameRaw: string, format: string): string {
  // slug ASCII safe : lowercase, alphanumeric + tirets, pas de :: ni d'espaces
  const slug = `${format}-${nameRaw}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug;
}

interface InventoryState {
  items: InventoryItem[];
  setItems: (incomingItems: Omit<InventoryItem, 'status' | 'favorite' | 'personalNote' | 'customTags'>[]) => void;
  setStatus: (id: string, status: PluginStatus) => void;
  toggleFavorite: (id: string) => void;
  setNote: (id: string, note: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (incomingItems) => {
        const currentItems = get().items;
        
        const mergedItems = incomingItems.map(incoming => {
          const existing = currentItems.find(e => e.id === incoming.id);
          if (existing) {
            return { 
              ...incoming, 
              status: existing.status, 
              favorite: existing.favorite,
              personalNote: existing.personalNote ?? '',
              customTags: existing.customTags ?? []
            } as InventoryItem;
          }
          return { 
            ...incoming, 
            status: 'UNCLASSIFIED', 
            favorite: false,
            personalNote: '',
            customTags: []
          } as InventoryItem;
        });

        set({ items: mergedItems });
      },

      setStatus: (id, status) => {
        const items = get().items;
        const item = items.find(i => i.id === id);
        if (item && item.status !== status) {
          useSessionLogStore.getState().log({ type: 'status_changed', from: item.status, to: status });
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        }));
      },

      toggleFavorite: (id) => {
        const items = get().items;
        const item = items.find(i => i.id === id);
        if (item) {
          useSessionLogStore.getState().log({ type: 'favorite_toggled', newValue: !item.favorite });
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, favorite: !item.favorite } : item
          ),
        }));
      },

      setNote: (id, note) => {
        useSessionLogStore.getState().log({ type: 'note_added', length: note.length });
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, personalNote: note } : item
          ),
        }));
      },

      addTag: (id, tag) => {
        const normalizedTag = tag.trim().toLowerCase();
        if (!normalizedTag) return;
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && !item.customTags.includes(normalizedTag)
              ? { ...item, customTags: [...item.customTags, normalizedTag] }
              : item
          ),
        }));
      },

      removeTag: (id, tag) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id 
              ? { ...item, customTags: item.customTags.filter(t => t !== tag) }
              : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      reset: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'pluginbase-inventory-v1',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const needsMigration = state.items.some(i => i.id.includes('::') || i.id.includes(' '));
        if (needsMigration) {
          state.items = state.items.map(i => ({ ...i, id: buildItemId(i.nameRaw, i.format) }));
        }
      },
    }
  )
);
