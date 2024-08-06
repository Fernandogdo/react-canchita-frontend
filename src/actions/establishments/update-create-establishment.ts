import { isAxiosError } from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import type { Establishment } from '../../domain/entities/establishment';
import type { EstablishmentResponse } from '../../infrastructure/interfaces/establishment/establishment.response';
import { EstablishmentMapper } from '../../infrastructure/mappers/establishment.mapper';

export const registerEstablishment = async (establishment: Establishment) => {
  try {
    const { data } = await tesloApi.post<EstablishmentResponse>('/establishment/', establishment);
    return EstablishmentMapper.establishmentResponseToEntity(data);
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error de Axios:', error.response?.data);
    }
    throw new Error('Error al registrar el establecimiento');
  }
};
