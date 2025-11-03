import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    set({ token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null });
  },
}));

// Initialize token from localStorage on mount
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('token');
  if (storedToken && !useAuthStore.getState().token) {
    useAuthStore.getState().setToken(storedToken);
  }
}

