import { create } from 'zustand';
import { StorageKeys } from '../types/generalTypes';

export interface AuthState {
  token: string | null;
}

interface AuthActions {
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  token: null,
  setToken: (token: string | null) => {
    if (token) localStorage.setItem(StorageKeys.token, token);
    else localStorage.removeItem(StorageKeys.token);
    set(() => ({ token }));
  },
}));
