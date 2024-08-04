import { API_URL } from '../../config/api/tesloApi';
import type { Establishment } from '../../domain/entities/establishment';
import type { EstablishmentResponse } from '../interfaces/establishment/establishment.response';

export class EstablishmentMapper {
  static establishmentResponseToEntity(establishmentResponse: EstablishmentResponse): Establishment {
    return {
      id: establishmentResponse.id,
      name: establishmentResponse.name,
      description: establishmentResponse.description,
      ruc: establishmentResponse.ruc,
      canton_id: Number(establishmentResponse.canton),
      address: establishmentResponse.address,
      latitude: establishmentResponse.latitude,
      longitude: establishmentResponse.longitude,
      google_address: establishmentResponse.google_address,
      opening_time: establishmentResponse.opening_time,
      closing_time: establishmentResponse.closing_time,
      user_id: establishmentResponse.user,
      validated: establishmentResponse.validated,
      isActive: establishmentResponse.isActive,
    };
  }
}
