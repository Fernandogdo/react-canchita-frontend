import {isAxiosError} from 'axios';
import {tesloApi} from '../../config/api/tesloApi';
import type {EstablishmentResponse} from '../../infrastructure/interfaces/establishment/establishment.response';
import {EstablishmentMapper} from '../../infrastructure/mappers/establishment.mapper';

export const getEstablishments = async () => {
  try {
    const {data} = await tesloApi.get<{
      message: string;
      data: EstablishmentResponse[];
    }>('/establishment/');
    console.log('🚀 ~ getEstablishments ~ data:', data);
    return data.data.map(EstablishmentMapper.establishmentResponseToEntity);
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        `Error de Axios (${error.response?.status}):`,
        error.response?.data,
      );
    }
    throw new Error('Error al obtener los establecimientos');
  }
};
