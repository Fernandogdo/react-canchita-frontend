export interface AuthResponse {
  id?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  roles?: string[];
  token?: string;
  access?: string; // Token de acceso que se recibe en el login
  refresh?: string; // Token de refresh que se recibe en el login
}
