import axios from "axios";
import { API_URL } from "./API";

const accessToken = localStorage.getItem("authToken");

const API = axios.create({
    baseURL: API_URL,
    headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default API;