import API from "@/config/Axios";
import { useQuery } from "@tanstack/react-query";


export const fetchStoreWithUserDetails = async (ownerId: string) => {
  const { data } = await API.get(`/stores/storeWithOwner`, {
    params: { ownerId },
  });
  return data;
};
const fetchStores = async () => {
  const response = await API.get(`/stores/shops-dashboard-select`);
  return response.data;
};

const fetchStoreDetail = async (id:string) => {
  const response = await API.get(`/stores/shps/${id}`);
  return response.data;
};

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
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


export const useStoreWithUserDetails = (storeId: string | undefined) => {
  return useQuery({
    queryKey: ["storeUserDetail", storeId],
    queryFn: () => fetchStoreWithUserDetails(storeId!),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};

