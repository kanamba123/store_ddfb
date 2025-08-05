import axios from "axios";
import { notifyError } from "../components/ui/ToastNotification"; 
import config from "../config/config";

export const fetchDataService = async (endPoint) => {
  try {
    const response = await axios.get(`${config.API_BASE_URL}/${endPoint}`);
    return response.data;
  } catch (error) {
    notifyError("Failed to fetch data");
    throw error; 
  }
};
