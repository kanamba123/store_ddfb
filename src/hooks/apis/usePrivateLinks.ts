import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifyError, notifySuccess } from "@/components/ui/ToastNotification";
import API from "@/config/Axios";

// 🔧 Gestion d’erreur standardisée
const throwError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.message || "Erreur serveur inconnue.");
  } else {
    throw new Error("Erreur inconnue.");
  }
};

// 🧠 ---- API CALLS ----
const fetchPrivateLinks = async () => {
  try {
    const res = await API.get("/public-upload");
    return res.data;
  } catch (error) {
    throwError(error);
  }
};

const generatePrivateLink = async (payload: {
  userId: number;
  targetId: number;
  targetType: string;
  validHours: number;
  targetUserName: string;
}) => {
  try {
    const res = await API.post("/public-upload/generateLinkToSiginUp", payload);
    return res.data;
  } catch (error) {
    throwError(error);
  }
};

const deletePrivateLink = async (id: number) => {
  try {
    await API.delete(`/public-upload/${id}`);
    return id;
  } catch (error) {
    throwError(error);
  }
};

const deleteMultiplePrivateLinks = async (ids: number[]) => {
  try {
    await Promise.all(ids.map((id) => API.delete(`/public-upload/${id}`)));
    return ids;
  } catch (error) {
    throwError(error);
  }
};

// 🧩 ---- HOOKS ----

// Récupérer tous les liens
export const usePrivateLinks = () => {
  const {
    data: links = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["privateLinks"],
    queryFn: fetchPrivateLinks,
    // onError: (error: Error) => notifyError(error.message),
  });

  return { links, isLoading, isError, refetch };
};

// Générer un lien
export const useGeneratePrivateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generatePrivateLink,
    onSuccess: (newLink) => {
      notifySuccess("Lien généré avec succès !");
      queryClient.setQueryData(["privateLinks"], (old: any) =>
        old ? [newLink, ...old] : [newLink]
      );
    },
    onError: (error: Error) => notifyError(error.message),
  });
};

// Supprimer un lien
export const useDeletePrivateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrivateLink,
    onSuccess: (id) => {
      notifySuccess("Lien supprimé avec succès !");
      queryClient.setQueryData(["privateLinks"], (old: any) =>
        old?.filter((link: any) => link.id !== id)
      );
    },
    onError: (error: Error) => notifyError(error.message),
  });
};

// Supprimer plusieurs liens
export const useDeleteMultiplePrivateLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMultiplePrivateLinks,
    onSuccess: (deletedIds) => {
      notifySuccess("Liens supprimés avec succès !");
      queryClient.setQueryData(["privateLinks"], (old: any) =>
        old?.filter((link: any) => !deletedIds?.includes(link.id))
      );
    },
    onError: (error: Error) => notifyError(error.message),
  });
};
