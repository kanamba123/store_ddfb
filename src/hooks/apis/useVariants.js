import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifySuccess, notifyError } from "@/components/ui/ToastNotification";
import API from "@/config/Axios";
import { API_URL } from "@/config/API";

// 🔹 Fonction pour récupérer les variantes
const fetchVariants = async () => {
  try {
    const response = await API.get("/variantesProduits/ad");
    return response.data;
  } catch (error) {
    throwError(error); 
  }
};

// 🔹 Fonction pour créer une nouvelle variant  product
const createVariantProduct = async (newSale) => {
  try {
    console.log(newSale)

    const response = await API.post("/variantesProduits/fromStore", newSale);

    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const fetchVariantesProductsByProduct = async (productId) => {
  try {
    const response = await API.get(`/variantesProduits/getByProd/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits par catégorie :",
      error
    );
    throw error;
  }
};


const fetchDetailVariantesProducts = async (variantProductId) => {
  try {
    const response = await API.get(
      `/variantesProduits/ad/${variantProductId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du details du variant du produits  :",
      error
    );
    throw error;
  }
};

// Hook personnalisé pour récupérer les variantes d'un produit
export const useVariantesProductsByProduct = (productId) => {
   const {
     data: variantsProduct = [], 
     isLoading: isLoadingVariantByProd, 
     isError: isErrorByProd, 
     refetch: refetchVariants,  
   } = useQuery({
     queryKey: ["variantsProduct", productId], 
     queryFn: () => fetchVariantesProductsByProduct(productId),
     enabled: Boolean(productId),
     staleTime: 1000 * 60 * 5,
     cacheTime: 1000 * 60 * 10, 
     refetchOnWindowFocus: false, 
   });

   return { variantsProduct, isLoadingVariantByProd, isErrorByProd, refetchVariants };
};


// 🔹 Hook pour créer une variant product
export const useCreateVariantProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVariantProduct,
    onSuccess: () => {
      notifySuccess("variant créée avec succès !");
      queryClient.invalidateQueries(["variants"]);
    },
    onError: (error) => {
      notifyError(error.message || "Échec de la création de la variant.");
    },
  });
};

// Hook personnalisé pour récupérer les details du variante d'un produit
export const useVariantesDetailsVariantProducts = (variantProductId) => {
  const {
    data: detailVariantsProduct,
    isLoading: isLoadingDetailVariant,
    isError: isErrorDetailVariantProduct,
    refetch: refetchDetailVariants,
  } = useQuery({
    queryKey: ["detailVariantsProduct", variantProductId],
    queryFn: () => fetchDetailVariantesProducts(variantProductId),
    enabled: Boolean(variantProductId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return {
    data: detailVariantsProduct,
    isLoadingDetailVariant,
    isErrorDetailVariantProduct,
    refetchDetailVariants,
  };
};


// 🔹 Fonction de gestion des erreurs
const throwError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.message || "Erreur serveur inconnue.");
  } else {
    throw new Error("Erreur inconnue.");
  }
};

// 🔹 Hook pour obtenir les variantes
export const useVariants = () => {
  return useQuery({
    queryKey: ["variants"],
    queryFn: fetchVariants,
    onError: (error) => {
      notifyError(error.message); 
    },
  });
};

// 🔹 Hook pour supprimer des variantes
export const useDeleteVariants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantIds) => {
      try {
        await Promise.all(
          variantIds.map((id) =>
            axios.delete(`${API_URL}/variantesProduits/${id}`)
          )
        );
      } catch (error) {
        throwError(error); 
      }
    },
    onSuccess: () => {
      notifySuccess("Variantes supprimées avec succès !");
      queryClient.invalidateQueries(["variants"]);
    },
    onError: (error) => {
      notifyError(error.message || "Échec de la suppression des variantes.");
    },
  });
};

// 🔹 Hook pour **mettre à jour** une variante
export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedVariant) => {
      try {
        const response = await axios.put(
          `${API_URL}/variantesProduits/${updatedVariant.id}`,
          updatedVariant
        );
        return response.data;
      } catch (error) {
        throwError(error); 
      }
    },
    onSuccess: (updatedVariant) => {
      queryClient.setQueryData(["variants"], (oldVariants) => {
        if (!oldVariants) return [];
        return oldVariants.map((item) =>
          item.id === updatedVariant.id ? { ...item, ...updatedVariant } : item
        );
      });

      queryClient.refetchQueries(["variants"]);
    },
    onError: (error) => {
      notifyError(error.message || "Échec de la mise à jour de la variante.");
    },
  });
};

const variantHooks = {
  useVariants,
  useCreateVariantProduct,
  useDeleteVariants,
  useUpdateVariant,
};

export default variantHooks;
