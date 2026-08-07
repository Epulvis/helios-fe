import { create } from 'zustand';
import { AuthUser, AuthState } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: AuthUser | null) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
