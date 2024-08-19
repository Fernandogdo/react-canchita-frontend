// src/domain/entities/province.ts
export interface Province {
    id: number;
    description: string;
    isActive: boolean;
  }
  
  // src/domain/entities/canton.ts
  export interface Canton {
    id: number;
    description: string;
    isActive: boolean;
    province: number;
  }
  