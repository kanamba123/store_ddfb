import { VariantsProduct } from "./VariantsProduct";

export interface Product {
    id: number;
    productName: string;
    description:{
      en?: string;
      fr?: string;
      sw?: string;
      kir?: string;
    };
    targetMarket?: string;
    slug?: string;
    image: string | null;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    variantes?: VariantsProduct[];
    category?: {
      id: number;
      categoryName: string;
    };
  }