import { create } from 'zustand';

interface UiState {
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isOffline: false,
  setOffline: (isOffline) => set({ isOffline }),
}));
