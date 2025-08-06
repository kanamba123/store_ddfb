import API from "@/config/Axios";
import { useQuery } from "@tanstack/react-query";

const fetchCategories = async () => {
  const response = await API.get(`/categories`);
  return response.data;
};


export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

