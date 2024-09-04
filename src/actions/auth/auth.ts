import axios from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import { User } from '../../domain/entities/user';
import { AuthResponse } from '../../infrastructure/interfaces/auth.responses';
import { Alert } from 'react-native';

const returnUserToken = (data: any, isLogin: boolean) => {
  const user: User = {
    id: data.id.toString(),  // Ahora accedes directamente a data
    email: data.email,
    fullName: `${data.first_name} ${data.last_name}`,
    isActive: data.is_active,
    roles: [data.role],
    validated: data.validated,
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

    // Asumiendo que la respuesta es como la que mencionaste:
    const result = returnUserToken({
      ...data, // data contiene `token`, `refresh`, y `user`
      id: data.user.id,
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      is_active: data.user.is_active,
      role: data.user.role,
      validated: data.user.validated,
    }, true);

    return result;

  } catch (error: any) {
    let mensaje = "No nos pudimos conectar al servidor";

    if (error.response) {
      const errorData = error.response.data;
      if (errorData && errorData.error) {
        mensaje = errorData.error??errorData.detail??"Error al iniciar sesión";
      } else {
        mensaje = "Error al iniciar sesión";
      }
    }

    return {
      mensaje: mensaje,
    };
  }
};




export const authRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  idType: string,
  idNumber: string,
  password: string,
  role: 'E' | 'C'
) => {
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

    // Extrae el usuario de data
    return returnUserToken(data.data, false);

  } catch (error: any) {
    console.log('Error al crear la cuenta:', error);

    // Extrae el mensaje de error desde la respuesta del servidor
    const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
    
    // Devuelve el error capturado
    return { success: false, message: errorMessage };
  }
};


export const sendOTP = async (emailOrId: string) => {
  try {
    const { data } = await tesloApi.post('/users/reset_otp/', {
      value: emailOrId,
    });
    console.log('OTP enviado exitosamente:', data);
    return { success: true,message: data.detail};
  } catch (error) {
    console.log('Error al enviar OTP:', error);
    return { success: false, message: 'No se pudo enviar el código de validación. Inténtalo de nuevo.' };
  }
};


export const accountValidator = async (code: string, user_id: string) => {
  console.log("🚀 ~ accountValidator ~ user_id:", user_id)
  try {
    const { data } = await tesloApi.post(`/users/${user_id}/validate_email/`, {
      code, 
    });
    console.log("🚀 ~ accountValidator ~ data:", data);
    return { success: true, data }; // Devuelve los datos si la validación es exitosa
  } catch (error: any) {
    console.log("Error al validar la cuenta:", error);
    
    let message = 'No se pudo validar la cuenta. Inténtalo de nuevo.';

    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message; // Extrae el mensaje de error del backend
    }

    return { success: false, message, data: error.response?.data?.data || [] }; // Devuelve el mensaje y cualquier dato relevante
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

export const resetPass = async (emailOrId: string,code_otp:string,password:string) => {
  try {
    const { data } = await tesloApi.post('/users/reset_password/', {
      value: emailOrId,
      code_otp,
      password,
    });

    console.log('OTP enviado exitosamente:', data);
    return { success: true,message: data.detail};
  } catch (error) {
    console.log('Error al enviar OTP:', error);
    return { success: false, message: 'No se pudo restablecer la contraseña. Inténtalo de nuevo.' };
  }
};
