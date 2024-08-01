import axios from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import { User } from '../../domain/entities/user';
import type { AuthResponse } from '../../infrastructure/interfaces/auth.responses';

const returnUserToken = (data: AuthResponse) => {
  const user: User = {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    isActive: data.isActive,
    roles: data.roles,
  };

  return {
    user: user,
    token: data.token,
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

export const authRegister = async (fullName: string, lastName: string, email: string, idType: string, idNumber: string, password: string) => {
  email = email.toLowerCase();

  // Simulación de una respuesta exitosa
  const simulatedResponse = {
    id: '12345',
    email,
    fullName: `${fullName} ${lastName}`,
    isActive: true,
    roles: ['user'],
    token: 'fake-jwt-token'
  };

  // Simula una demora
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Cuenta creada exitosamente:', simulatedResponse);
  return returnUserToken(simulatedResponse);
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
