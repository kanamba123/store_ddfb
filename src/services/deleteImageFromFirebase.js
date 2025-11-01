// src/services/deleteImageFromFirebase.js
import { storage } from "../firebaseConfig";


import { ref, deleteObject } from "firebase/storage"; // Importer les méthodes nécessaires
// src/services/deleteImageFromFirebase.js

export const deleteImageFromFirebase = async (imageUrl, onDeleteSuccess = () => { }) => {
  if (!imageUrl) {
    // Si imageUrl est null ou undefined, ne rien faire
    return;
  }

  try {
    // Extraire le chemin du fichier depuis l'URL (en supposant que l'URL de l'image est structurée correctement)
    const path = imageUrl;

    // Créer une référence au fichier dans Firebase Storage

    let fileRef

    if (Array.isArray(path)) {
      // Si imageUrl est un tableau, tenter de supprimer chaque URL
      for (const url of path) {

        fileRef = ref(storage, url);
        await deleteObject(fileRef);
        onDeleteSuccess();
      }
    } else if (typeof path === "string") {
      fileRef = ref(storage, path);
      // Supprimer l'image du stockage Firebase
      await deleteObject(fileRef);
      onDeleteSuccess();
    } else {
      console.error("Type de imageUrl non supporté :", typeof imageUrl);
    }



  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
  }
};

