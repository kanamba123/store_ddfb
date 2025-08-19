import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImagesToFirebase = async (files) => {
    const uploadPromises = files.map(async (file) => {
        if (!file) return null;

        const storageRef = ref(storage, `uploads/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        } catch (error) {
            console.error("Error uploading image to Firebase Storage", error);
            throw new Error("Failed to upload image");
        }
    });

    return Promise.all(uploadPromises);
};
