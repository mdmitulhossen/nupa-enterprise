import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageKeys } from '../types/generalTypes';
import { type IPlatFormUser } from '../types/user';

export interface UserState {
  user: IPlatFormUser | null;
}

interface UserActions {
  setUser: (user: IPlatFormUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: IPlatFormUser | null) => {
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: StorageKeys.user,
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
