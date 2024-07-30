import { create } from 'zustand';
import { User } from '../../../domain/entities/user';
import { AuthStatus } from '../../../infrastructure/interfaces/auth.status';
import { authCheckStatus, authLogin, authRegister } from '../../../actions/auth/auth';
import { StorageAdapter } from '../../../config/adapters/storage-adapter';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, lastName: string, email: string, idType: string, idNumber: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    if (!resp) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return false;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({ status: 'authenticated', token: resp.token, user: resp.user });

    return true;
  },

  register: async (fullName: string, lastName: string, email: string, idType: string, idNumber: string, password: string) => {
    const resp = await authRegister(fullName, lastName, email, idType, idNumber, password);
    if (!resp) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return false;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({ status: 'authenticated', token: resp.token, user: resp.user });

    return true;
  },

  logout: async () => {
    await StorageAdapter.removeItem('token');
    set({ status: 'unauthenticated', token: undefined, user: undefined });
  },

  checkStatus: async () => {
    const token = await StorageAdapter.getItem('token');
    if (!token) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return;
    }

    const resp = await authCheckStatus();
    if (!resp) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return;
    }

    await StorageAdapter.setItem('token', resp.token);
    set({ status: 'authenticated', token: resp.token, user: resp.user });
  },
}));
