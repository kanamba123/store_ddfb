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

            console.warn("⚠️ Token expiré ou invalide, ouverture du panneau de login.", status);

            console.warn("⚠️ Token expiré ou invalide, ouverture du panneau de login.");

            // Supprimer le token stocké
            localStorage.removeItem("authToken");

            // Ici tu peux soit :
            // 1. Rediriger vers la page de login
            // window.location.href = "/login";

            // 2. Déclencher un Event global → ton app peut ouvrir un modal/panel
            const event = new Event("auth:expired");
            window.dispatchEvent(event);

            // ✅ Token expiré ou manquant
            if (status === 401 || status === 403) {
                console.warn("⚠️ Token expiré ou invalide, ouverture du panneau de login.");

                // Supprimer le token stocké
                localStorage.removeItem("authToken");

                // Ici tu peux soit :
                // 1. Rediriger vers la page de login
                // window.location.href = "/login";

                // 2. Déclencher un Event global → ton app peut ouvrir un modal/panel
                const event = new Event("auth:expired");
                window.dispatchEvent(event);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
