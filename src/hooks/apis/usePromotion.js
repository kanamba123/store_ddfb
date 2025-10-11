import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifySuccess, notifyError } from "../../components/ui/ToastNotification";
import API from "@/config/Axios";
import { API_URL } from "@/config/API";

const fetchPromotions = async () => {
  try {
    const response = await API.get("/promotions");
    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const fetchPromotionDetails = async (promotionId) => {
  try {
    const response = await API.get(`/promotions/${promotionId}`);
    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const createPromotion = async (newPromotion) => {
  try {
    const response = await API.post("/promotions", newPromotion);
    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const deletePromotion = async (promitionId) => {
  try {
    await API.delete(`/promotions/${promitionId}`);
  } catch (error) {
    throwError(error);
  }
};

const updatePromotion = async (updatePromotion) => {
  try {
    const response = await API.put(
      `/promotions/${updatePromotion.id}`,
      updatePromotion
    );
    return response.data;
  } catch (error) {
    throwError(error);
  }
};

const patchPromotionField = async ({ id, field, value }) => {
  if (!field || value === undefined) {
    throw new Error("Champ ou valeur manquants.");
  }

  try {
    const payload = { field, value };
    const response = await API.patch(`/promotions/${id}`, payload);
    return response.data;
  } catch (error) {
    throwError(error);
  }

  return { id, updatedField: field, updatedValue: data[field] };
};

const throwError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.message || "Erreur serveur inconnue.");
  } else {
    throw new Error("Erreur inconnue.");
  }
};

export const usePromotions = () => {
  const {
    data: promotions = [],
    isLoading: isLoadingPromotion,
    isError: isErrorPromotion,
    refetch: refetchPromotion,
  } = useQuery({
    queryKey: ["promotions"],
    queryFn: fetchPromotions,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    onError: (error) => {
      notifyError(error.message);
    },
  });

  return { promotions, isLoadingPromotion, isErrorPromotion, refetchPromotion };
};

export const usePromotionDetails = (promotionId) => {
  const {
    data: promotionDetails,
    isLoading: isLoadingPromotion,
    isError: isErrorPromotion,
    refetch: refetchPromotion,
  } = useQuery({
    queryKey: ["promotions", promotionId],
    queryFn: () => fetchPromotionDetails(promotionId),
    enabled: Boolean(promotionId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    onError: (error) => {
      notifyError(error.message);
    },
  });
  return {
    promotionDetails,
    isLoadingPromotion,
    isErrorPromotion,
    refetchPromotion,
  };
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPromotion,
    onSuccess: (newPromotion) => {
      notifySuccess("Promotion créée avec succès !");
      queryClient.invalidateQueries(["promotions"]);
    },
    onError: (error) => {
      notifyError(error.message || "Error to create promotion");
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePromotion,
    onSuccess: (updatedPromotion) => {
      queryClient.setQueryData(["promotions"], (odlPromotion) => {
        if (!odlPromotion) return [];
        return odlPromotion.map((promotion) =>
          promotion.id === updatedPromotion.id
            ? { ...promotion, ...(promotion.id === updatedPromotion.id) }
            : promotion
        );
      });

      notifySuccess("Promotion pdated successfullyu !");
      queryClient.invalidateQueries(["promotions"]);
    },
    onError: (error) => {
      notifyError(error.message || "Error to update promotion");
    },
  });
};

export const usePatchPromotionField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPromotionField,
    onSuccess: ({ id, updatedField, updatedValue }) => {
      queryClient.setQueryData(["promotions"], (oldPromotion) => {
        if (!oldPromotion) return [];
        return oldPromotion.map((promotion) =>
          promotion.id === id
            ? { ...promotion, [updatedField]: updatedValue }
            : promotion
        );
      });

      notifySuccess("field updated successfully!");
    },
    onError: (error) => {
      notifyError(error.message || "Error when updating.");
    },
  });
};

export const useDeleteOnePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      notifySuccess("Promotion deleted successfully !");
      queryClient.invalidateQueries(["promotions"]);
    },
    onError: (error) => {
      notifyError(error.message || "Error to delete promotion.");
    },
  });
};

export const useDeletePromotions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotionsId) => {
      await Promise.all(
        promotionsId.map((id) =>
          axios.delete(`${API_URL}/promotions/${id}`)
        )
      );
    },
    onSuccess: () => {
      notifySuccess("Promotions deleted successfully !");
      queryClient.invalidateQueries(["promotions"]);
    },
    onError: () => {
      notifyError("Échec de la suppression des promotions.");
    },
  });
};

const PromotionsHooks = {
  usePromotions,
  usePromotionDetails,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotions,
  useDeleteOnePromotion,
  usePatchPromotionField,
};

export default PromotionsHooks;
