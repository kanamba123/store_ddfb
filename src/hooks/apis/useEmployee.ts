import API from "@/config/Axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ========================
// API FUNCTIONS
// ========================

// Get all employees
const fetchEmployees = async () => {
  const { data } = await API.get(`/employees`);
  return data;
};

// Get all soft-deleted employees
const fetchEmployeesDeleted = async () => {
  const { data } = await API.get(`/employees/trash`);
  return data;
};

// Get one employee by ID
const fetchEmployeeDetail = async (id: string) => {
  const { data } = await API.get(`/employees/${id}`);
  return data;
};

// Get one deleted employee by ID
const fetchDeletedUserDetail = async (id: string) => {
  const { data } = await API.get(`/users/trash/${id}`);
  return data;
};

// Create new employee
const createEmployee = async (employeeData: any) => {
  const { data } = await API.post(`/employees/withoutUser`, employeeData);
  return data;
};

// Create employee with generated token
const createEmployeeByGenerateToken = async (employeeData: any) => {
  const { data } = await API.post(
    `/employees/withoutUserGenerateToken`,
    employeeData
  );
  return data;
};

// Create User for Employee
const joinUserForEmployee = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  const response = await API.post(`/employees/${id}/createUser`, data);
  return response.data;
};

// Update employee
const updateEmployee = async ({
  id,
  updates,
}: {
  id: string;
  updates: any;
}) => {
  const { data } = await API.put(`/employees/${id}`, updates);
  return data;
};

// Delete employee
const deleteEmployee = async (id: string) => {
  const { data } = await API.delete(`/employees/${id}`);
  return data;
};

// Delete user for employee
const deleteUserForEmployee = async (id: string) => {
  const { data } = await API.delete(`/employees/userForEmploye/${id}`);
  return data;
};

// Restore soft-deleted employee
const restoreEmployee = async (id: number) => {
  const { data } = await API.put(`/employees/restore/${id}`);
  return data;
};

// Permanently delete employee
const permanentDeleteEmployee = async (id: number) => {
  const { data } = await API.delete(`/employees/permanent-delete/${id}`);
  return data;
};

// ========================
// HOOKS
// ========================

export const useEmployees = () =>
  useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useEmployeesDeleted = () =>
  useQuery({
    queryKey: ["employeesDeleted"],
    queryFn: fetchEmployeesDeleted,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useEmployeeDetail = (id: string | undefined) =>
  useQuery({
    queryKey: ["employeeDetail", id],
    queryFn: () => fetchEmployeeDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

// Hook pour récupérer un utilisateur supprimé par ID
export const useDeletedUserDetail = (id: string | undefined) =>
  useQuery({
    queryKey: ["deletedEmployeeDetail", id],
    queryFn: () => fetchDeletedUserDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const useCreateEmployeeByGenerateToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployeeByGenerateToken,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const useJoinUserForEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinUserForEmployee,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employeeDetail", variables.id] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employeeDetail", variables.id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const useDeleteUserForEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserForEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const usePermanentDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permanentDeleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
};
