import axios from "axios";
import { API_URL } from "./API";

// Création instance
const API = axios.create({
    baseURL: API_URL,
});

// Intercepteur de requête → injecte toujours le token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur de réponse → gère erreurs liées au token
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                console.warn("⚠️ Token expiré ou invalide, ouverture du panneau de login.");

                localStorage.removeItem("authToken");

                const event = new Event("auth:expired");
                window.dispatchEvent(event);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
