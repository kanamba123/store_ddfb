import { useQuery } from "@tanstack/react-query";
import { API } from "@/config/Axios";

const fetchStores = async () => {
  const response = await API.get(`/stores/shops`);
  return response.data;
};

const fetchStoreDetail = async (id:String) => {
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

export const useStoreDetail = (storeId:String) => {
  return useQuery({
    queryKey: ["storeDetail", storeId],
    queryFn: () => fetchStoreDetail(storeId),
    enabled: !!storeId, 
    staleTime: 5 * 60 * 1000,
  });
};
