import API from "@/config/Axios";


export const fetchProductDetails = async (id:number) => {
  const { data } = await API.get(
    `/variantesProduits/${id}`
  );
  return data;
};

export const  fetchSimilarProducts = async (category:string) =>{
 
    const { data } = await API.get(
        `/products?category=${category}&limit=5`
      );
      return data;
    
}


export const  fetchProductVariantByProd = async (productId:string) =>{

 
    const { data } = await API.get(
        `/variantesProduits/byProduct/${productId}`
      );
      return data;
    
}


export const fetchProductForCatDetails = async (id:number) => {
  const { data } = await API.get(
    `/products/getDetailProductCat/${id}`
  );
  return data;
};


// Dans @/api/products.ts
export const fetchProductVariantsBySearch = async (query: string) => {
  try {
    const endpoint = `/variantesProduits/search?query=${encodeURIComponent(query)}`;

    const { data } = await API.get(endpoint);

    return data;
  } catch (error: any) {
    console.error('[fetchProductVariantsBySearch] Error:', error?.response || error.message || error);
    throw error;
  }
};

export const fetchProductVariantsBySearchIdCategory = async (categoryId: string) => {
  try {
    const endpoint = `/variantesProduits/searchbyCatId?categoryId=${categoryId}`;

    const { data } = await API.get(endpoint);

    return data;
  } catch (error: any) {
    console.error('[fetchProductVariantsBySearchIdCategory] Error:', error?.response || error.message || error);
    throw error;
  }
};


