import API from "@/config/Axios";
import { useQuery } from "@tanstack/react-query";


export const fetchStoreWithUserDetails = async (ownerId: string) => {
  const { data } = await API.get(`/stores/storeWithOwner`, {
    params: { ownerId },
  });
  return data;
};

// Fetch stores for condition filters (e.g., dropdowns) )
const fetchStoresByConditionFilters = async () => {
  const response = await API.get(`/stores/visibles`);
  return response.data;
};

const fetchStoreDetail = async (id:string) => {
  const response = await API.get(`/stores/shps/${id}`);
  return response.data;
};

export const useFetchStoresByConditionFilters = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: fetchStoresByConditionFilters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};



export const useStoreDetail = (storeId:string) => {
  return useQuery({
    queryKey: ["storeDetail", storeId],
    queryFn: () => fetchStoreDetail(storeId),
    enabled: !!storeId, 
    staleTime: 5 * 60 * 1000,
  });
};


export const useStoreWithUserDetails = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["storeUserDetail", userId],
    queryFn: () => fetchStoreWithUserDetails(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

