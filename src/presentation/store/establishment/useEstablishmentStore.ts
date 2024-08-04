import { create } from 'zustand';
import { Establishment } from '../../../domain/entities/establishment';
import { registerEstablishment } from '../../../actions/establishments/update-create-establishment';

interface EstablishmentState {
  establishments: Establishment[];
  createEstablishment: (establishment: Establishment) => Promise<boolean>;
}

export const useEstablishmentStore = create<EstablishmentState>((set) => ({
  establishments: [],

  createEstablishment: async (establishment) => {
    try {
      const newEstablishment = await registerEstablishment(establishment);
      set((state) => ({
        establishments: [...state.establishments, newEstablishment],
      }));
      return true;
    } catch (error) {
      console.error('Error al crear el establecimiento:', error);
      return false;
    }
  },
}));
