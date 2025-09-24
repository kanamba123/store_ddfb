import API from "@/config/Axios";
import { Market } from "@/types/market";
import { VariantsProduct } from "@/types/VariantsProduct";

// Fetch markets 
export const fetchMarkets = async (id: number) => {
  const { data } = await API.get(`/markets/fromDashS`);
  return data as Market;
};



