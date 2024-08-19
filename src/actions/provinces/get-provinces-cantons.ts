import { tesloApi } from '../../config/api/tesloApi';

export const getProvinces = async () => {
  try {
    const { data } = await tesloApi.get('/province/');
    return data; // Devuelve las provincias directamente
  } catch (error) {
    console.error('Error al obtener las provincias:', error);
    throw new Error('Error al obtener las provincias');
  }
};

export const getCantonsByProvince = async (provinceId: number) => {
  try {
    const { data } = await tesloApi.get(`/province/${provinceId}/cantones`);
    return data; // Devuelve los cantones de la provincia seleccionada
  } catch (error) {
    console.error('Error al obtener los cantones:', error);
    throw new Error('Error al obtener los cantones');
  }
};
