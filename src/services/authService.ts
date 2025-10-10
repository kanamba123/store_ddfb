
import API from "@/config/Axios";

export const loginUser = async (password: string): Promise<any> => {
  try {
    const response = await API.post(`/auth/confirmAction`, { password });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Axios a reçu une réponse du serveur
      const serverMessage =
        error.response.data?.message || "Erreur inconnue du serveur";

      // Tu peux aussi récupérer le code si besoin
      const statusCode = error.response.status;

      // Retourne une erreur personnalisée
      throw new Error(`${statusCode} - ${serverMessage}`);
    } else if (error.request) {
      throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
    } else {
      throw new Error(error.message || "Erreur lors de la connexion");
    }
  }
};

