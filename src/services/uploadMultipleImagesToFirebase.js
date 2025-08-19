import { storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify"; // Importer toast

// Fonction pour télécharger plusieurs images avec suivi de progression
export const uploadMultipleImagesToFirebase = async (
  files,
  customName = "win2cop_name",
  folderRef = "win2cop_folder"
) => {
  if (!files || files.length === 0) return [];

  // Tableau de promesses d'upload
  const uploadPromises = files.map(async (file, index) => {
    // Nettoyer et formater le nom du fichier
    const fileExtension = file.name.split(".").pop();
    const timestamp = Date.now();
    const cleanCustomName = customName.replace(/\s+/g, "_").toLowerCase();
    const newFileName = `${cleanCustomName}_${timestamp}.${fileExtension}`;

    // Créer une référence Firebase Storage
    const storageRef = ref(storage, `${folderRef}/${newFileName}`);

    // Créer un upload resumable pour suivre la progression
    const uploadTask = uploadBytesResumable(storageRef, file);

    // ID unique pour la notification
    const toastId = `upload-progress-${index}`;

    // Afficher une notification initiale
    toast.info(`Uploading ${file.name}... 0%`, {
      toastId: toastId,
      progress: 0,
      autoClose: false, // Ne pas fermer automatiquement
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculer la progression
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // Mettre à jour la notification
          toast.update(toastId, {
            render: `Uploading ${file.name}... ${Math.round(progress)}%`,
            progress: progress / 100,
          });
        },
        (error) => {
          // Gérer l'erreur
          console.error(`Error uploading ${file.name}:`, error);
          toast.update(toastId, {
            render: `Failed to upload ${file.name}`,
            type: "error",
            autoClose: 3000,
          });
          reject(error);
        },
        async () => {
          // Une fois l'upload terminé, récupérer l'URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Mettre à jour la notification pour indiquer que c'est terminé
          toast.update(toastId, {
            render: `Upload complete: ${file.name}`,
            type: "success",
            progress: 1,
            autoClose: 2000,
          });

          resolve(downloadURL);
        }
      );
    });
  });

  return Promise.all(uploadPromises); // Attendre que toutes les promesses soient résolues et retourner les URLs
};
