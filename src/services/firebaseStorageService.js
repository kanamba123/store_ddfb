import { storage } from "../firebaseConfig"; // Importer l'instance storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Importer les fonctions de Storage
import { toast } from "react-toastify"; // Utiliser react-toastify pour les notifications

// Fonction pour télécharger une image sur Firebase Storage avec un nom personnalisé
export const uploadImageToFirebase = async (
  file,
  customName = "win2cop_name",
  folderRef = "win2cop_folder"
) => {
  if (!file) return null;

  // Nettoyer et formater le nom du fichier
  const fileExtension = file.name.split(".").pop(); // Récupérer l'extension du fichier
  const timestamp = Date.now(); // Ajouter un timestamp pour éviter les doublons
  const cleanCustomName = customName.replace(/\s+/g, "_").toLowerCase(); // Nettoyer le nom passé en paramètre
  const newFileName = `${cleanCustomName}_${timestamp}.${fileExtension}`; // Concaténer le tout

  // Créer une référence dans Storage
  const storageRef = ref(storage, `${folderRef}/${newFileName}`);

  // Créer un upload resuming pour suivre la progression
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Afficher une notification de départ
  toast.info("Uploading image... 0%", {
    toastId: "upload-progress", // Utiliser un ID unique pour la notification
    progress: 0,
  });

  try {
    return new Promise((resolve, reject) => {
      // Suivre la progression du téléchargement
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculer le pourcentage de progression
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Mettre à jour la notification avec le pourcentage
          toast.update("upload-progress", {
            render: `Uploading image... ${Math.round(progress)}%`,
            progress: progress / 100, // La progression doit être entre 0 et 1
          });
        },
        (error) => {
          // Gérer les erreurs de téléchargement
          console.error("Error uploading image to Firebase Storage", error);
          toast.error("Failed to upload image.");
          reject(new Error("Failed to upload image"));
        },
        async () => {
          // Lorsque l'upload est terminé
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          toast.update("upload-progress", {
            render: "Upload complete!",
            progress: 1, // Progression terminée
            type: "success",
          });
          // Fermer la notification après 1 seconde (ou selon ton besoin)
          setTimeout(() => {
            toast.dismiss("upload-progress"); // Ferme la notification
          }, 1000); // Après 1 seconde
          resolve(downloadURL); // Retourner l'URL de l'image téléchargée
        }
      );
    });
  } catch (error) {
    console.error("Error uploading image", error);
    toast.error("Failed to upload image.");
    throw new Error("Failed to upload image");
  }
};
