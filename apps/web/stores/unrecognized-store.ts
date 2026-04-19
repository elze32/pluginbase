import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UnrecognizedItem {
  nameRaw: string;
  format: string;
  firstSeenAt: number;
  count: number;
}

interface UnrecognizedState {
  items: UnrecognizedItem[];
  record: (nameRaw: string, format: string) => void;
  export: () => string; // JSON
  clear: () => void;
}

export const useUnrecognizedStore = create<UnrecognizedState>()(
  persist(
    (set, get) => ({
      items: [],

      record: (nameRaw, format) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.nameRaw === nameRaw && i.format === format
          );

          if (existingIndex !== -1) {
            const nextItems = [...state.items];
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              count: nextItems[existingIndex].count + 1,
            };
            return { items: nextItems };
          }

          return {
            items: [
              ...state.items,
              {
                nameRaw,
                format,
                firstSeenAt: Date.now(),
                count: 1,
              },
            ],
          };
        });
      },

      export: () => {
        return JSON.stringify(get().items, null, 2);
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'pluginbase-unrecognized-v1',
    }
  )
);
