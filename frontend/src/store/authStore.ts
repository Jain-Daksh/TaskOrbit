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

const STORAGE_KEY = 'auth';

export const useAuthStore = create<AuthState>((set) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialState = saved ? JSON.parse(saved) : { user: null, token: null, refreshToken: null };

  const persist = (state: Partial<AuthState>) => {
    const newState = { ...initialState, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
  };

  return {
    ...initialState,
    setToken: (token) => set((state) => persist({ ...state, token })),
    setUser: (user) => set((state) => persist({ ...state, user })),
    setRefreshToken: (refreshToken) => set((state) => persist({ ...state, refreshToken })),
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, token: null, refreshToken: null });
    },
  };
});