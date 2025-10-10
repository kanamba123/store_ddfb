import API from "@/config/Axios";
import { useQuery } from "@tanstack/react-query";

const fetchMarkets = async () => {
  const response = await API.get(`/markets/fromDashS`);
  return response.data;
};

const fetchMarketsDetail = async (marketId:any) => {
  const response = await API.get(
    `/markets/${marketId}`
  );
  return response.data;
};

export const useMarkets = () => {
  return useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });
};

export const useShopsByMarket = (marketId:any) => {
  return useQuery({
    queryKey: ["shopsByMarket", marketId],
    queryFn: () => fetchMarketsDetail(marketId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
