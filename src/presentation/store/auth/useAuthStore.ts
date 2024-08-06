import { create } from 'zustand';
import { User } from '../../../domain/entities/user';
import { AuthStatus } from '../../../infrastructure/interfaces/auth.status';
import { authCheckStatus, authLogin, authRegister } from '../../../actions/auth/auth';
import { StorageAdapter } from '../../../config/adapters/storage-adapter';

export interface AuthState {
  status: AuthStatus;
  accessToken?: string;
  refreshToken?: string;
  user?: User;

  login: (email: string, password: string) => Promise<any>;
  register: (
    firstName: string, 
    lastName: string, 
    email: string, 
    idType: string, 
    idNumber: string, 
    password: string, 
    role: 'E' | 'C'
  ) => Promise<any>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,

  
  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);

    // Verifica si la respuesta tiene un token de acceso y de refresh
    if (resp && 'token' in resp && resp.token) {
      await StorageAdapter.setItem('accessToken', resp.token);
      await StorageAdapter.setItem('refreshToken', resp.refreshToken);
      set({ status: 'authenticated', accessToken: resp.token, refreshToken: resp.refreshToken });
      return {
        transaccion: true,
      };
    } 

    // Maneja el caso de error o no autenticado
    set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
    return {
      transaccion: false,
      mensaje: resp.mensaje || "Error al iniciar sesión",
    };
  },

  register: async (firstName, lastName, email, idType, idNumber, password, role) => {
    const resp = await authRegister(firstName, lastName, email, idType, idNumber, password, role);
    if (!resp) {
      set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
      return false;
    }
    
    // Verifica si hay un token de acceso (en registro normalmente no se recibe, pero es buena práctica verificar)
    if (resp.token) {
      await StorageAdapter.setItem('accessToken', resp.token);
      set({ status: 'authenticated', accessToken: resp.token, user: resp.user });
    } else {
      set({ status: 'unauthenticated', accessToken: undefined, user: resp.user });
    }

    return resp;
  },

  logout: async () => {
    await StorageAdapter.removeItem('accessToken');
    await StorageAdapter.removeItem('refreshToken');
    set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
  },

  checkStatus: async () => {
    const accessToken = await StorageAdapter.getItem('accessToken');
    const refreshToken = await StorageAdapter.getItem('refreshToken');
    if (!accessToken) {
      set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
      return;
    }

    const resp = await authCheckStatus();
    if (!resp) {
      set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
      return;
    }

    await StorageAdapter.setItem('accessToken', resp.token);
    set({ status: 'authenticated', accessToken: resp.token, user: resp.user });
  },
}));
