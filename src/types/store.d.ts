// types/store.d.ts
export interface StoreByOwner {
  id: number;
  storeName: string;
  storeType: "physical" | "online" | "both";
  nif: string | null;
  rc: string | null;
  bp: string | null;
  activitySector: string | null;
  taxCenter: string | null;
  storeAddress: string;
  city: string;
  country: string;
  postalCode: string;
  storeContactPhone: {
    call: string;
    whatsapp?: string;
  };
  storeContactMail: string;
  personReferences: Array<{
    name: string;
    phone: string;
    relation: string;
  }>;
  storeStatus: "active" | "inactive" | "suspended";
  storeDescription: string;
  storePlatformUrl: string[];
  ownerId: number;
  marketId: number | null;
  location: {
    lat: number;
    lng: number;
  } | null;
  documents: Array<{
    type: string;
    url: string;
    status: "pending" | "approved" | "rejected";
  }>;
  logoUrl: string | null; // Added for store logo
  coverImageUrl: string | null; // Added for store cover image
  galleryImages: string[]; // Added for store gallery
  isDisplay: boolean;
  isTemporary: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  openingHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  paymentMethods?: string[];
}
