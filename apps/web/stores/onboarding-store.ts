import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  hasCompletedFirstScan: boolean;
  hasSeenWelcome: boolean;
  markFirstScanDone: () => void;
  dismissWelcome: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedFirstScan: false,
      hasSeenWelcome: false,

      markFirstScanDone: () => set({ hasCompletedFirstScan: true }),
      
      dismissWelcome: () => set({ hasSeenWelcome: true }),

      reset: () => set({ hasCompletedFirstScan: false, hasSeenWelcome: false }),
    }),
    {
      name: 'pluginbase-onboarding-v1',
    }
  )
);
