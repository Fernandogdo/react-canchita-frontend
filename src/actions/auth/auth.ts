import axios from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import { User } from '../../domain/entities/user';
import { AuthResponse } from '../../infrastructure/interfaces/auth.responses';

const returnUserToken = (data: any, isLogin: boolean) => {
  const user: User = {
    id: data.user.id.toString(),
    email: data.user.email,
    fullName: `${data.user.first_name} ${data.user.last_name}`,
    isActive: data.user.is_active,
    roles: [data.user.role],
    validated: data.user.validated,  // Incluye la propiedad validated
  };

  if (isLogin) {
    return {
      mensaje: data.detail ?? "Login exitoso",
      token: data.token || null,
      refreshToken: data.refresh || null,
      user: user,
    };
  } else {
    return {
      user: user,
      token: null,
    };
  }
};




export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  try {
    const { data } = await tesloApi.post('/token/', {
      username: email,
      password: password,
    });
    console.log('Login:', data);
    return returnUserToken(data, true);
  } catch (error: any) {
    let mensaje = "";

    if (error.response) {
      const errorData = error.response.data;
      if (errorData && errorData.detail) {
        mensaje = errorData.detail;
      } else {
        mensaje = "Error al iniciar sesión";
      }
    } else if (error.request) {
      mensaje = "No nos pudimos conectar al servidor";
    } else {
      mensaje = "No nos pudimos conectar al servidor";
    }

    return {
      mensaje: mensaje
    };
  }
};



export const authRegister = async (firstName: string, lastName: string, email: string, idType: string, idNumber: string, password: string, role: 'E' | 'C') => {
  email = email.toLowerCase();

  try {
    const { data } = await tesloApi.post('/users/', {
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      type_identification: idType,
      identification_number: idNumber,
      password,
    });

    console.log('Cuenta creada exitosamente:', data);

    // Si no se recibe un token, solo devuelve la información del usuario
    return returnUserToken(data.data,false);

  } catch (error) {
    console.log('Error al crear la cuenta:', error);
    return null;
  }
};

export const sendOTP = async (emailOrId: string) => {
  try {
    const { data } = await tesloApi.post('/users/reset_otp/', {
      value: emailOrId,
    });
    console.log('OTP enviado exitosamente:', data);
    return { success: true };
  } catch (error) {
    console.log('Error al enviar OTP:', error);
    return { success: false, message: 'No se pudo enviar el código de validación. Inténtalo de nuevo.' };
  }
};


export const authCheckStatus = async () => {
  try {
    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');
    return returnUserToken(data,false);
  } catch (error) {
    console.log({ error });
    return null;
  }
};
