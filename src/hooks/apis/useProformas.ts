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
    queryKey: ["proformaDetail", id],
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
        queryKey: ["proformaDetail", variables.id],
      });
    },
  });
};

// 🔹 Supprimer un proforma
export const useDeleteProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProforma,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["proformas"] }),
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
