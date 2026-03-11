import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setRefreshToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  logout: () => set({ user: null, token: null, refreshToken: null }),
}));