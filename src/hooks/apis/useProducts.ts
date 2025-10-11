import API from "@/config/Axios";
import { useInfiniteQuery, useQuery, useIsMutating, useQueryClient, useMutation } from "@tanstack/react-query";
import { notifySuccess, notifyError } from "../../components/ui/ToastNotification";
import axios from "axios";

const throwError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.message || "Erreur serveur inconnue.");
  } else {
    throw new Error("Erreur inconnue.");
  }
};

const fetchProductCategories = async () => {
  const response = await API.get(`/products/byAdminSelect`);
  return response.data;
};


// Hook to fetch product categories to display in select options
export const useProductsCat = () => {
  return useQuery({
    queryKey: ["productsCategories"],
    queryFn: fetchProductCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useProducts = () => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.get(`/variantesProduits?page=${pageParam}&limit=10`);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.flatMap(page => page.data)
    }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useProductsCategorie = () => {
  return useInfiniteQuery({
    queryKey: ["productsCategorie"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.get(`/products/prodCat?page=${pageParam}&limit=10`);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};


//get variants products by store
export const useVariantsProductByStore = (ownerProducstoreId?: number) => {
  return useInfiniteQuery({
    queryKey: ["productsFeatured", ownerProducstoreId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.get(
        `/variantesProduits/byStore`,
        {
          params: {
            ownerProducstoreId,
            page: pageParam,
            limit: 5,
          }
        }
      );
      return response.data;
    },
    enabled: !!ownerProducstoreId, // only run when ID exists
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};


//get variants products deleted by store
export const useVariantsProductByStoreDeleted = (ownerProducstoreId?: number) => {
  return useInfiniteQuery({
    queryKey: ["productsDeleted", ownerProducstoreId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.get(
        `/variantesProduits/trash`,
        {
          params: {
            ownerProducstoreId,
            page: pageParam,
            limit: 5,
          }
        }
      );
      return response.data;
    },
    enabled: !!ownerProducstoreId, // only run when ID exists
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ✅ version simplifiée
export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string | number) => {
      try {
        await API.delete(`/variantesProduits/permanent-delete/${productId}`);
      } catch (error) {
        console.log("Hello delete", error);
        throw error; // ✅ plus clair que "throwError" si non défini
      }
    },
    onSuccess: () => {
      notifySuccess("Produit supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["productsDeleted"] });
    },
    onError: (error: any) => {
      notifyError(error.message || "Erreur lors de la suppression du produit.");
    },
  });
};





