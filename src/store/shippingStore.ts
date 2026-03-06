
import { StorageKeys } from '@/types/generalTypes';
import { ShippingAddress } from '@/types/product';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ShippingState {
  address: ShippingAddress | null;
  setAddress: (address: ShippingAddress) => void;
  clearAddress: () => void;
}

export const useShippingStore = create<ShippingState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      clearAddress: () => set({ address: null }),
    }),
    {
      name: StorageKeys.shippingAddress,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ address: state.address }),
    }
  )
);