import { notifyError, notifySuccess } from "@/components/ui/ToastNotification";
import API from "@/config/Axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ========================
// API FUNCTIONS
// ========================

// Get all proformas
const fetchProformas = async () => {
  const { data } = await API.get(`/proforma`);
  return data;
};

// Get one proforma by ID
const fetchProformaDetail = async (id: string) => {
  const { data } = await API.get(`/proforma/${id}`);
  return data;
};

// Create new proforma
const createProforma = async (proformaData: any) => {
  const { data } = await API.post(`/proforma`, proformaData);
  return data;
};

// Update existing proforma
const updateProforma = async ({
  id,
  updates,
}: {
  id: string;
  updates: any;
}) => {
  const { data } = await API.put(`/proforma/${id}`, updates);
  return data;
};

// Soft delete proforma
const deleteProforma = async (id: string) => {
  const { data } = await API.delete(`/proforma/${id}`);
  return data;
};

// Restore soft-deleted proforma
const restoreProforma = async (id: number) => {
  const { data } = await API.patch(`/proforma/${id}/restore`);
  return data;
};

// 🔹 Fonction PATCH pour mettre à jour un champ spécifique d'un proformat
// 🔹 Fonction PATCH pour mettre à jour un champ spécifique d’un proforma
const patchProformaField = async ({
  id,
  field,
  value,
}: {
  id: string;
  field: string;
  value: any;
}) => {
  if (!field || value === undefined) {
    throw new Error("Champ ou valeur manquants.");
  }

  try {
    const payload = { value, field };
    const { data } = await API.patch(`/proforma/${id}`, payload);
    return { id, updatedField: field, updatedValue: value, data };
  } catch (error: any) {
    console.error("Erreur PATCH proforma:", error);
    throw new Error(error.response?.data?.message || "Erreur de mise à jour.");
  }
};

// ========================
// HOOKS
// ========================

// 🔹 Liste de tous les proformas
export const useProformas = () =>
  useQuery({
    queryKey: ["proformas"],
    queryFn: fetchProformas,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// 🔹 Détails d’un proforma
export const useProformaDetail = (id: string | undefined) =>
  useQuery({
    queryKey: ["proformas", id],
    queryFn: () => fetchProformaDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

// 🔹 Créer un proforma
export const useCreateProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProforma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proformas"] });
    },
  });
};

// 🔹 Modifier un proforma
export const useUpdateProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProforma,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proformas"] });
      queryClient.invalidateQueries({
        queryKey: ["proformas", variables.id],
      });
    },
  });
};


// 🔹 Détails d’un proforma
export const useProformaDetails = (id?: string) =>
  useQuery({
    queryKey: ["proformas", id],
    queryFn: () => fetchProformaDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });


// 🔹 Supprimer un proforma
export const useDeleteProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProforma,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["proformas"] }),
  });
};

// 🔹 Hook pour mettre à jour un champ spécifique d'une vente (PATCH)

export const usePatchProformaField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProformaField,

    // ✅ Succès : met à jour le cache React Query
    onSuccess: ({ id, updatedField, updatedValue }) => {
      // Met à jour la liste des proformas en cache
      queryClient.setQueryData(["proformas"], (oldProformas: any) => {
        if (!oldProformas) return [];
        return oldProformas.map((p: any) =>
          p.id === id ? { ...p, [updatedField]: updatedValue } : p
        );
      });

      // Met à jour le détail du proforma si ouvert
      queryClient.setQueryData(["proformas", id], (oldDetail: any) => {
        if (!oldDetail) return oldDetail;
        return { ...oldDetail, [updatedField]: updatedValue };
      });

      notifySuccess("Champ mis à jour avec succès !");
    },

    onError: (error: any) => {
      notifyError(error.message || "Erreur lors de la mise à jour.");
    },
  });
};

// 🔹 Restaurer un proforma supprimé
export const useRestoreProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreProforma,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["proformas"] }),
  });
};
