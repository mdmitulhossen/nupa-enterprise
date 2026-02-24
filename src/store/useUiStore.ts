import { create } from 'zustand';

export interface UiState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));