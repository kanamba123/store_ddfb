import { Product } from "./Product";
import { Specification } from "./Specification";

export interface VariantsProduct {
  id: number;
  image: string[];
  variantProductName: string;
  recommendedPrice: number;
  purchasePrice: number;
  sellingPrice: number;
  status: string;
  isDisplay: boolean;
  slug: string
  Product: Product;
  description: string;
  variantType: string;
  productId: string;
  storeId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  qrCode: string;
  specifications: Specification;
  productCode: string;
  functions: any[];
  features: any[];
  isPromotion: boolean;
  promotion: any;
  promotionId: number | null;
}