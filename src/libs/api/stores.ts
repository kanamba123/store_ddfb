import API from "@/config/Axios";

export const fetchStoreDetails = async (id: number) => {
  const { data } = await API.get(`/stores/${id}`);
  return data;
};

export const fetchStoreWithUserDetails = async (ownerId: number) => {
  const { data } = await API.get(`/stores/storeWithOwner`, {
    params: { ownerId },
  });
  return data;
};


export const updateStoreDetails = async (id: number, storeData: any) => {
  const { data } = await API.put(`/stores/${id}`, storeData);
  return data;
};