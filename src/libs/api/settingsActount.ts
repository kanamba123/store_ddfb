
import API from "@/config/Axios";

export const deleteAcountStore = async () => {
  const { data } = await API.delete(`/settingsAcount/deleteAcount`);
  return data as { message: string }; 
};