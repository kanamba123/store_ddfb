// hooks/apis/useCustomers.ts
import API from "@/config/Axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifySuccess, notifyError } from "@/components/ui/ToastNotification";

// ========================
// TYPES
// ========================
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

// ========================
// API FUNCTIONS
// ========================

// Get all customers
const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await API.get("/customers");
  return data;
};

// Get customer details by ID
const fetchCustomerDetails = async (id: number): Promise<Customer> => {
  const { data } = await API.get(`/customers/${id}`);
  return data;
};

// Create new customer
const createCustomer = async (customerData: Partial<Customer>) => {
  const { data } = await API.post("/customers", customerData);
  return data;
};

// Update customer
const updateCustomer = async ({ id, updates }: { id: number; updates: Partial<Customer> }) => {
  const { data } = await API.put(`/customers/${id}`, updates);
  return data;
};

// Delete customer
const deleteCustomer = async (id: number) => {
  const { data } = await API.delete(`/customers/${id}`);
  return data;
};

// ========================
// HOOKS
// ========================

// All customers
export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// Customer details
export const useCustomerDetails = (id: number | undefined) =>
  useQuery({
    queryKey: ["customerDetail", id],
    queryFn: () => fetchCustomerDetails(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

// Create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
};

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customerDetail", variables.id] });
      notifySuccess("Client mis à jour avec succès !");
    },
    onError: (error: any) => notifyError(error?.message ?? "Erreur lors de la mise à jour du client"),
  });
};

// Delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      notifySuccess("Client supprimé avec succès !");
    },
    onError: (error: any) => notifyError(error?.message ?? "Erreur lors de la suppression du client"),
  });
};

// ========================
// EXPORT COMBINED
// ========================
const customerHooks = {
  useCustomers,
  useCustomerDetails,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
};

export default customerHooks;
