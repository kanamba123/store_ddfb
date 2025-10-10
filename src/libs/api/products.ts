import API from "@/config/Axios";
import { Product } from "@/types/Product";
import { VariantsProduct } from "@/types/VariantsProduct";

// Récupère les détails d'une variante spécifique
export const fetchVariantDetails = async (id: number) => {
  const { data } = await API.get(`/variantesProduits/${id}`);
  return data as VariantsProduct;
};

// Récupère les catégories de produits (pour les select options)
export const fetchProductCategories = async () => {
  const { data } = await API.get(`/products/byAdminSelect`);
  return data as Product[];
};

// Crée une nouvelle variante de produit
export const createVariant = async (formData: FormData) => {
  const { data } = await API.post('/variantesProduits', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data as VariantsProduct;
};

// Met à jour une variante existante
export const updateVariant = async (id: number, formData: FormData) => {
  const { data } = await API.put(`/variantesProduits/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data as VariantsProduct;
};

// Récupère une variante par son ID
export const getVariantById = async (id: string | number) => {
  const { data } = await API.get(`/variantesProduits/byStore/${id}`);
  return data ;
};

// Fonctions pour les produits (conservées pour compatibilité)
export async function createProduct(data: Partial<VariantsProduct>) {
  const response = await API.post('/api/products', data);
  return response.data as VariantsProduct;
}

export async function updateProduct(id: number, data: Partial<VariantsProduct>) {
  const response = await API.put(`/api/products/${id}`, data);
  return response.data as VariantsProduct;
}

export async function getProductById(id: string | number) {
  const response = await API.get(`/api/products/${id}`);
  return response.data as VariantsProduct;
}

// Supprime une variante par son ID
export const deleteVariant = async (id: string | number) => {
  const { data } = await API.delete(`/variantesProduits/${id}`);
  return data as { message: string }; 
};
