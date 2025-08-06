import { Product } from "./Product";

export interface VariantsProduct {
  id: number;
  image: string[];
  variantProductName: string;
  sellingPrice: number;
  status: string;
  Product: Product;
}