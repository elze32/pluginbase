import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PluginStatus } from './inventory-store';

export type LogEventData =
  | { type: 'scan_attempted' }
  | { type: 'scan_succeeded'; pluginsFound: number; recognizedCount: number }
  | { type: 'scan_cancelled' }
  | { type: 'scan_browser_unsupported'; userAgent: string }
  | { type: 'status_changed'; from: PluginStatus; to: PluginStatus }
  | { type: 'favorite_toggled'; newValue: boolean }
  | { type: 'duplicates_viewed'; multiFormat: number; functional: number }
  | { type: 'plugin_detail_opened' }
  | { type: 'note_added'; length: number }
  | { type: 'filter_used'; filterKey: string }
  | { type: 'page_view'; path: string };

export type LogEvent = LogEventData & { at: number };

interface SessionLogState {
  events: LogEvent[];
  sessionStartedAt: number;
  log: (event: LogEventData) => void;
  clear: () => void;
  export: () => string;
}

export const useSessionLogStore = create<SessionLogState>()(
  persist(
    (set, get) => ({
      events: [],
      sessionStartedAt: Date.now(),

      log: (eventData) => {
        const at = Date.now();
        set((state) => {
          const nextEvents = [...state.events, { ...eventData, at } as LogEvent];
          if (nextEvents.length > 500) {
            nextEvents.shift(); // FIFO
          }
          return { events: nextEvents };
        });
      },

      clear: () => set({ events: [], sessionStartedAt: Date.now() }),

      export: () => {
        const state = get();
        return JSON.stringify({
          sessionStartedAt: state.sessionStartedAt,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
          timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'unknown',
          eventsCount: state.events.length,
          events: state.events,
        }, null, 2);
      }
    }),
    {
      name: 'pluginbase-session-log-v1',
    }
  )
);
