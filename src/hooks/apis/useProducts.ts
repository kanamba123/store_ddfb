import API from "@/config/Axios";
import { useInfiniteQuery, useQuery, useIsMutating } from "@tanstack/react-query";


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
    queryKey: ["productsFeatured", ownerProducstoreId],
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



