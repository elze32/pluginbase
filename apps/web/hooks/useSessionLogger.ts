import { useSessionLogStore } from '../stores/session-log-store';

export function useSessionLogger() {
  return useSessionLogStore(s => s.log);
}
