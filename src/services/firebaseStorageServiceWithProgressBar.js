import { storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Fonction pour télécharger plusieurs images sur Firebase Storage avec suivi de progression
export const firebaseStorageServiceWithProgressBar = async (files, onProgressUpdate) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `products/${file.name}`); // Créer une référence pour chaque fichier
      const uploadTask = uploadBytesResumable(storageRef, file); // Utiliser uploadBytesResumable pour suivre la progression

      // Écouter les événements de progression
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgressUpdate(progress); // Appeler la fonction de mise à jour de progression
        },
        (error) => {
          console.error(`Error uploading ${file.name} to Firebase Storage`, error);
          reject(new Error(`Failed to upload ${file.name}`));
        },
        async () => {
          // Récupérer l'URL après le téléchargement
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  });

  return Promise.all(uploadPromises);
};
