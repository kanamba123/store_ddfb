
import API from "@/config/Axios";


export const fetchProductDetails = async (id:number) => {
  const { data } = await API.get(
    `/variantesProduits/${id}`
  );
  return data;
};


export const  fetchProductCategories = async () =>{
    const { data } = await API.get(
        `/products/byAdminSelect`
      );
      
      return data;
}





