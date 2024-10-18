import {create} from 'zustand';
import {Establishment} from '../../../domain/entities/establishment';
import {registerEstablishment} from '../../../actions/establishments/update-create-establishment';
import {getEstablishments} from '../../../actions/establishments/get-establishments';

interface EstablishmentState {
  establishments: Establishment[];
  createEstablishment: (establishment: Establishment) => Promise<boolean>;
  fetchEstablishments: () => Promise<void>;
}

export const useEstablishmentStore = create<EstablishmentState>(set => ({
  establishments: [],

  createEstablishment: async establishment => {
    try {
      const newEstablishment = await registerEstablishment(establishment);
      set(state => ({
        establishments: [...state.establishments, newEstablishment],
      }));
      return true;
    } catch (error) {
      console.error('Error al crear el establecimiento:', error);
      return false;
    }
  },

  fetchEstablishments: async () => {
    try {
      const establishments = await getEstablishments();
      set(state => ({
        ...state, // Mantiene el estado actual por si hay más propiedades en el futuro
        establishments,
      }));
    } catch (error) {
      console.error('Error al obtener los establecimientos:', error);
    }
  },
}));
