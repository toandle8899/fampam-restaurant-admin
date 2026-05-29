import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  default_address?: string;
}

interface AuthState {
  customer: Customer | null;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      token: null,

      login: async (email, password) => {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        set({ customer: res.customer, token: res.token });
      },

      signup: async (name, email, password) => {
        const res = await apiFetch('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        set({ customer: res.customer, token: res.token });
      },

      logout: () => set({ customer: null, token: null }),

      updateProfile: async (data) => {
        const token = get().token;
        const res = await apiFetch('/auth/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        set({ customer: res.customer });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'fampam-auth',
    }
  )
);
