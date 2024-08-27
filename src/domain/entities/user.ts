export interface User {
  id:       string;
  email:    string;
  fullName: string;
  isActive: boolean;
  roles:    string[];
  validated: boolean;  // Nueva propiedad añadida
}
