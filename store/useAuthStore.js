import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  confirmationResult: null,
  user: null,

  setConfirmationResult: (confirmationResult) => set({ confirmationResult }),
  clearConfirmationResult: () => set({ confirmationResult: null }),

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
