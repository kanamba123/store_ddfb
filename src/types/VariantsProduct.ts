import { Product } from "./Product";

export interface VariantsProduct {
  id: number;
  image: string[];
  variantProductName: string;
  recommendedPrice: number;
  purchasePrice: number;
  specifications: string[] | null;
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

}