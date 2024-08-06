import axios from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import { User } from '../../domain/entities/user';
import { AuthResponse } from '../../infrastructure/interfaces/auth.responses';

const returnUserToken = (data: any, isLogin: boolean) => {
  if (isLogin) {
    // Login, donde se devuelve los tokens
    return {
      mensaje: data.detail ?? "Login exitoso",
      token: data.access || null,   // token de acceso
      refreshToken: data.refresh || null, // token de refresco
    };
  } else {
    // Registro, información del usuario sin tokens
    const user: User = {
      id: data.id.toString(),
      email: data.email,
      fullName: `${data.first_name} ${data.last_name}`,
      isActive: data.is_active,
      roles: [data.role],
    };

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

export const authCheckStatus = async () => {
  try {
    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');
    return returnUserToken(data,false);
  } catch (error) {
    console.log({ error });
    return null;
  }
};
