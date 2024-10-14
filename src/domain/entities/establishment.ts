export interface Establishment {
  id?: string;
  name: string;
  description: string;
  ruc: string;
  address: string;
  latitude: string;
  longitude: string;
  google_address: string;
  opening_time: string;
  closing_time: string;
  user_id?: number;
  validated?: boolean;
  isActive?: boolean;
  qualification?: number;
  main_image?: string;
  images_courts?: []; // Cambiar a opcional
  province: string; // Añadir provincia
  canton: string;   // Añadir canton
}
