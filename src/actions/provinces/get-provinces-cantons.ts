import axios from 'axios';
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

export const getCantonsByProvince = async (provinceId: number, signal?: AbortSignal) => {
  console.log("🚀 ~ getCantonsByProvince ~ provinceId:", provinceId);
  try {
    const { data } = await tesloApi.get(`/province/${provinceId}/cantones`, { signal });
    return data.data || []; // Asegura que siempre se devuelve un array
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      console.error('Error al obtener los cantones:', error);
      throw new Error('Error al obtener los cantones');
    }
  }
};



