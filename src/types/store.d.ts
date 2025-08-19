export interface StoreByOwner {
  id: number;
  storeName: string;
  storeType: "physical" | "online" | "both" | "retail"; // added "retail"
  nif: string | null;
  rc: string | null;
  bp: string | null;
  activitySector: string | null;
  taxCenter: string | null;
  storeAddress: string;
  city: string;
  country: string;
  postalCode?: string; // optional because it's not in the response
  storeContactPhone: {
    call: string,
    Whatsapp: string,
    Busness :string,
    Communication :sirng

  }; // changed from object to string[]
  storeContactMail: string;
  personReferences: Array<{
    name: string;
    phone: string;
    relation: string;
  }>;
  storeStatus: "active" | "inactive" | "suspended";
  storeDescription: string | null;
  storePlatformUrl: string[] | null; // changed to allow null
  ownerId: number;
  marketId: number | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  documents: Array<{
    type: string;
    url: string;
    status: "pending" | "approved" | "rejected";
  }>;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  galleryImages?: string[];

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

  OwnerStore: {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    businessName: string;
    profil: string;
  };

  Market: {
    id: number;
    marketName: string;
    marketType: string;
    contact: string;
    adressMarket: string;
  };
}
