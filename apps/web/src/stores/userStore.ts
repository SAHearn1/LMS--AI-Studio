import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { api } from '@/lib/api/client';

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        api.setToken(token);
        set({ token });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', { email, password });
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          if (response.data) {
            api.setToken(response.data.accessToken);
            set({ 
              user: response.data.user, 
              token: response.data.accessToken,
              isLoading: false 
            });
            return true;
          }
          
          return false;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/register', data);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          if (response.data) {
            api.setToken(response.data.accessToken);
            set({ 
              user: response.data.user, 
              token: response.data.accessToken,
              isLoading: false 
            });
            return true;
          }
          
          return false;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        api.setToken(null);
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      },

      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await api.get<User>('/auth/me');
          
          if (response.data) {
            set({ user: response.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.setToken(state.token);
        }
      },
    }
  )
);
