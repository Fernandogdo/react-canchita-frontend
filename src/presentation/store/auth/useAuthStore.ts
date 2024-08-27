import { create } from 'zustand';
import { User } from '../../../domain/entities/user';
import { AuthStatus } from '../../../infrastructure/interfaces/auth.status';
import { accountValidator, authCheckStatus, authLogin, authRegister, sendOTP } from '../../../actions/auth/auth';
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
  validateOtp: (code: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,

  
  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
  
    if (resp && 'token' in resp && resp.token) {
      await StorageAdapter.setItem('accessToken', resp.token);
      await StorageAdapter.setItem('refreshToken', resp.refreshToken);
  
      // Verificación de la propiedad validated
      if (resp.user.validated === false) {
        // Si validated es false, se envía el correo al endpoint para enviar el OTP
        const otpResponse = await sendOTP(resp.user.email);
        if (!otpResponse.success) {
          return {
            transaccion: false,
            mensaje: otpResponse.message,
          };
        }
      }
  
      set({
        status: 'authenticated',
        accessToken: resp.token,
        refreshToken: resp.refreshToken,
        user: resp.user,
      });
      return {
        transaccion: true,
        user: resp.user,
      };
    }
  
    set({
      status: 'unauthenticated',
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
    });
    return {
      transaccion: false,
      mensaje: resp.mensaje || "Error al iniciar sesión",
    };
  },
  
  
  
  

  register: async (firstName, lastName, email, idType, idNumber, password, role) => {
    const resp = await authRegister(firstName, lastName, email, idType, idNumber, password, role);
    
    if ('success' in resp && resp.success === false) {
      // Manejar el caso donde la registración falló y se devolvió un error
      set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
      return resp; // Devuelve el error para que pueda ser manejado en la UI
    }
  
    if ('token' in resp && resp.token) {
      await StorageAdapter.setItem('accessToken', resp.token);
      set({ status: 'authenticated', accessToken: resp.token, user: resp.user });
    } else if ('user' in resp) {
      // Manejar el caso donde no se recibió un token, pero sí un usuario (registro exitoso sin token)
      set({ status: 'unauthenticated', accessToken: undefined, user: resp.user });
    } else {
      // Si no hay ni token ni usuario, algo salió mal
      set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
    }
  
    return resp;
  },
  
  
  

  logout: async () => {
    await StorageAdapter.removeItem('accessToken');
    await StorageAdapter.removeItem('refreshToken');
    set({ status: 'unauthenticated', accessToken: undefined, refreshToken: undefined, user: undefined });
  },

  //Validar cuenta con OTP
  validateOtp: async (code: string) => {
    const user = get().user;
    if (!user) {
      return {
        success: false,
        message: 'Usuario no autenticado',
      };
    }

    const resp = await accountValidator(code, user.id);
    if (resp.success) {
      set({
        user: {
          ...user,
          validated: true, // Actualiza el estado del usuario como validado
        },
      });
      return {
        success: true,
        message: 'Cuenta validada exitosamente',
      };
    }

    return {
      success: false,
      message: resp.message || 'Error al validar el código',
    };
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
