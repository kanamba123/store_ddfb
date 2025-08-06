import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";
import config from "../../config/config";

// Récupérer tous les Customers
const fetchCustomers = async () => {
  const response = await api.get(`/customers`);
  return response.data;
};

// Récupérer les détails d'un Customer
const fetchCustomerDetails = async (CustomerId) => {
  const response = await api.get(`${config.API_BASE_URL}/customers/${CustomerId}`);
  return response.data;
};

// Ajouter un nouvel Customer
const addCustomer = async (newCustomer) => {
  const response = await api.post(`${config.API_BASE_URL}/customers`, newCustomer);
  return response.data;
};

// s'enregistrer 
const subscribeCustomer = async (newCustomer) => {
  const response = await api.post(`${config.API_BASE_URL}/register`, newCustomer);
  return response.data;
};

// Mettre à jour un Customer existant
const updateCustomer = async ({ CustomerId, CustomerData }) => {
  const response = await api.put(`${config.API_BASE_URL}/customers/${CustomerId}`, CustomerData);
  return response.data;
};

// Supprimer un Customer
const deleteCustomer = async (CustomerId) => {
  const response = await api.delete(`${config.API_BASE_URL}/customers/${CustomerId}`);
  return response.data;
};

// Récupérer les boutiques par Customer
const fetchShopsByCustomer = async (CustomerId) => {
  const response = await api.get(`${config.API_BASE_URL}/customers/${CustomerId}/boutiques`);
  return response.data;
};

// Exporter les hooks
export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCustomerDetails = (CustomerId) => {
  return useQuery({
    queryKey: ["customers", CustomerId],
    queryFn: () => fetchCustomerDetails(CustomerId),
    enabled: !!CustomerId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout d'un Customers:", error);
    }
  });
};

export const Customeregister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscribeCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout d'un Customers:", error);
    }
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour d'un Customer:", error);
    }
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression d'un Customer:", error);
    }
  });
};

export const useShopsByCustomer = (CustomerId) => {
  return useQuery({
    queryKey: ["customers", CustomerId, "boutiques"],
    queryFn: () => fetchShopsByCustomer(CustomerId),
    enabled: !!CustomerId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fonctions utilitaires
export const getCustomerRoles = () => {
  return [
    { value: 'admin', label: 'Administrateur' },
    { value: 'Customer', label: 'Customer standard' },
    { value: 'editor', label: 'Éditeur' }
  ];
};

export const getCustomerStatuses = () => {
  return [
    { value: 'actif', label: 'Actif' },
    { value: 'inactif', label: 'Inactif' },
    { value: 'en_attente', label: 'En attente' }
  ];
};