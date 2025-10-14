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

// Get all employees
const fetchEmployeesDeleted = async () => {
  const { data } = await API.get(`/employees/trash`);
  return data;
};

// Get one employee by ID
const fetchEmployeeDetail = async (id: string) => {
  const { data } = await API.get(`/employees/${id}`);
  return data;
};

// Create new employee
const createEmployee = async (employeeData: any) => {
  const { data } = await API.post(`/employees/withoutUser`, employeeData);
  return data;
};

// Create User for Employee
const joinUserForEmployee = async ({ id, data }: { id: string; data: any }) => {
  const response = await API.post(`/employees/${id}/createUser`, data);
  return response.data;
};

// Update employee
const updateEmployee = async ({ id, updates }: { id: string; updates: any }) => {
  const { data } = await API.put(`/employees/${id}`, updates);
  return data;
};

// Delete employee
const deleteEmployee = async (id: string) => {
  const { data } = await API.delete(`/employees/${id}`);
  return data;
};


// Delete user and employee
const deleteUserForEmployee = async (id: string) => {
  const { data } = await API.delete(`/employees/userForEmploye/${id}`);
  return data;
};

// ========================
// HOOKS
// ========================

// Fetch all employees
export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch all employees
export const useEmployeesDeleted = () => {
  return useQuery({
    queryKey: ["employeesDeleted"],
    queryFn: fetchEmployeesDeleted,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch single employee detail
export const useEmployeeDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employeeDetail", id],
    queryFn: () => fetchEmployeeDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create employee
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

// Create employee
export const useJoinUserForEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinUserForEmployee,
    onSuccess: (_, variables) => {
      // Invalider la liste globale
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Invalider aussi le détail de l’employé modifié
      queryClient.invalidateQueries({ queryKey: ["employeeDetail", variables.id] });
    },
  });
};

// Update employee
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

// Delete employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

// Delete employee
export const useDeleteUserForEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserForEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};


export const useRestoreEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await API.put(`/employees/restore/${id}`);
      return res.data;
    },
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const usePermanentDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await API.delete(`/employees/permanent-delete/${id}`);
      return res.data;
    },
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}; // Not used for now   

