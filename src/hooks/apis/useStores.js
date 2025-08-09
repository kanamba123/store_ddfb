import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import config from "../../config/config";
import { notifySuccess, notifyError } from "../../components/ui/ToastNotification";
import API from "@/config/Axios";
import { API_URL } from "@/config/API";

const throwError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.message || "Erreur serveur inconnue.");
  } else {
    throw new Error("Erreur inconnue.");
  }
};

const fetchStores = async () => {
  try {
    const response = await API.get("/stores");
    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const addStore = async (storeData) => {
  try {
    const response = await API.post("/stores", storeData);
    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const fetchStoreById = async (storeId) => {
  try {
    const response = await API.get(`/stores/${storeId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du magasin :", error);
    throw error;
  }
};

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    onError: (error) => {
      notifyError(error.message);
    },
  });
};

export const useAddStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStore,
    onSuccess: () => {
      notifySuccess("Store added successfully !");
      queryClient.invalidateQueries(["stores"]);
    },
    onError: (error) => {
      notifyError(error.message || "Échec de l'ajout du store.");
    },
  });
};

export const useStoreById = (storeId) => {
  return useQuery({
    queryKey: ["store", storeId],
    queryFn: () => fetchStoreById(storeId),
    enabled: Boolean(storeId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteStores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeIds) => {
      try {
        await Promise.all(
          storeIds.map((id) =>
            axios.delete(`${API_URL}/stores/${id}`)
          )
        );
      } catch (error) {
       
        throwError(error);
      }
    },
    onSuccess: () => {
      notifySuccess("Magasins supprimés avec succès !");
      queryClient.invalidateQueries(["stores"]);
    },
    onError: (error) => {
      notifyError(error.message || "Échec de la suppression des magasins.");
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedStore) => {
      try {
        const response = await axios.put(
          `${API_URL}/stores/${updatedStore.id}`,
          updatedStore
        );
        return response.data;
      } catch (error) {
        throwError(error);
      }
    },
    onSuccess: (updatedStore) => {
      queryClient.setQueryData(["stores"], (oldStores) => {
        if (!oldStores) return [];
        return oldStores.map((store) =>
          store.id === updatedStore.id ? { ...store, ...updatedStore } : store
        );
      });

      queryClient.refetchQueries(["stores"]);
    },
    onError: (error) => {
      notifyError(error.message || "Échec de la mise à jour du magasin.");
    },
  });
};


export const useDeleteAllStores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storesId) => {
      try {
        
        await Promise.all(storesId.map((id) => API.delete(`/stores/${id}`)));
      } catch (error) {
        console.log("Hello delete", error);
        throwError(error);
      }
    },
    onSuccess: () => {
      notifySuccess("Stores deleted successfullly !");
      queryClient.invalidateQueries(["stores"]);
    },
    onError: (error) => {
      notifyError(error.message || "Error to delete stores.");
    },
  });
};



const storeHooks = {
  useStores,
  useAddStore,
  useStoreById,
  useDeleteStores,
  useDeleteAllStores,
  useUpdateStore,
};

export default storeHooks;
