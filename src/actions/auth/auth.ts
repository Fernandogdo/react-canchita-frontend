import axios from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import { User } from '../../domain/entities/user';
import { AuthResponse } from '../../infrastructure/interfaces/auth.responses';

const returnUserToken = (data: any) => {
  const user: User = {
    id: data.id.toString(),
    email: data.email,
    fullName: `${data.first_name} ${data.last_name}`,
    isActive: data.is_active,
    roles: [data.role],
  };

  // Si no hay token, devuelve solo el usuario
  return {
    user: user,
    token: data.token || null, // Devuelve null si no hay token
  };
};

export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  // Simulación de una respuesta exitosa
  const simulatedResponse = {
    id: '12345',
    email,
    fullName: 'Simulated User',
    isActive: true,
    roles: ['user'],
    token: 'fake-jwt-token'
  };

  // Simula una demora
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Login exitoso:', simulatedResponse);
  return returnUserToken(simulatedResponse);
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
    return returnUserToken(data.data);

  } catch (error) {
    console.log('Error al crear la cuenta:', error);
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');
    return returnUserToken(data);
  } catch (error) {
    console.log({ error });
    return null;
  }
};
