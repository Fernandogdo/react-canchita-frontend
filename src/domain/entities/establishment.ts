export interface Establishment {
  id?: string;
  name: string;
  description: string;
  ruc: string;
  canton_id: number;
  address: string;
  latitude: string;
  longitude: string;
  google_address: string;
  opening_time: string;
  closing_time: string;
  user_id?: number;
  validated?: boolean;
  isActive?: boolean;
  qualification?:number;
  main_image?:string;
  images_courts:[];
}
