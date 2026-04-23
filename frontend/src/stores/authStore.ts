import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  admin: { id: number; username: string } | null;
  setAuth: (admin: { id: number; username: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  admin: null,
  setAuth: (admin) => set({ isAuthenticated: true, admin }),
  clearAuth: () => set({ isAuthenticated: false, admin: null }),
}));
