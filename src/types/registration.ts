// types/registration.ts
export interface OwnerData {
    id?: number;
    fullName: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    businessName?: string;
    documents?: any[];
    profil?: string;
  }
  
  export interface StoreData {
    id?: number;
    storeName: string;
    storeType: 'retail' | 'wholesale' | 'online' | 'physical';
    nif?: string;
    rc?: string;
    bp?: string;
    activitySector?: string;
    taxCenter?: string;
    storeAddress?: string;
    city: string;
    country: string;
    storeContactPhone?: string[];
    storeContactMail?: string;
    personReferences?: PersonReference[];
    storeStatus?: 'active' | 'inactive' | 'suspended';
    storeDescription?: string;
    storePlatformUrl?: string[];
    ownerId?: number;
    marketId?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
    documents?: any[];
    isDisplay?: boolean;
  }
  
  export interface PersonReference {
    name: string;
    phone: string;
    relation: string;
  }
  
  export interface RegistrationResponse {
    success: boolean;
    data?: {
      owner: OwnerData;
      store: StoreData;
    };
    message?: string;
    error?: string;
    details?: string[];
  }
  
  export interface OwnerResponse {
    success: boolean;
    data?: OwnerData;
    message?: string;
    error?: string;
    details?: string[];
  }
  
  export interface StoreResponse {
    success: boolean;
    data?: StoreData;
    message?: string;
    error?: string;
    details?: string[];
  }
  
  export interface FormErrors {
    [key: string]: string;
  }
  
  export type RegistrationStep = 'owner' | 'store' | 'confirmation';