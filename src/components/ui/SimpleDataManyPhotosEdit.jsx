import React, { useState } from "react";
import { uploadMultipleImagesToFirebase } from "../../services/uploadMultipleImagesToFirebase";
import { deleteImageFromFirebase } from "../../services/deleteImageFromFirebase";
import { notifySuccess, notifyError } from "./ToastNotification";
import URLUploader from "@/components/ui/URLUploader";
import ImageUploader from "./ImageUploader";
import { API_URL } from "@/config/API";
import { Trash2, Edit2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const SimpleDataManyPhotosEditInline = ({
  id,
  field,
  value,
  onSave,
  endpoint,
  editable = false,
  forder,
  namePitch,
  suffixName = "",
  delet = true,
}) => {
  const [images, setImages] = useState(value);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUploader, setSelectedUploader] = useState("image");
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { t } = useTranslation();

  const apiUrl = `${API_URL}/${endpoint}/${id}`;
  const nameForFile = `${namePitch}${(suffixName && suffixName.replace(/\s+/g, "_").toLowerCase()) || ""
    }`;

  // Ajouter une image depuis fichier
  const addNewPhoto = async () => {
    if (!selectedFile) return notifyError("Aucun fichier !");
    setLoading(true);
    try {
      const uploaded = await uploadMultipleImagesToFirebase(selectedFile, nameForFile, forder);
      const updatedImages = [...images, ...uploaded];
      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: updatedImages }),
      });
      if (!res.ok) throw new Error("Erreur upload");
      setImages(updatedImages);
      if (onSave) onSave(await res.json());
      notifySuccess("Images ajoutées !");
      setSelectedFile(null);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une image depuis URL
  const addNewPhotoUri = async () => {
    if (!selectedImage) return notifyError("Aucune URL !");
    setLoading(true);
    try {
      const updatedImages = [...images, selectedImage];
      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: updatedImages }),
      });
      if (!res.ok) throw new Error("Erreur ajout URL");
      setImages(updatedImages);
      if (onSave) onSave(await res.json());
      notifySuccess("Image ajoutée par URL !");
      setSelectedImage(null);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remplacer une image
  const replacePhoto = async (index) => {
    if (!selectedFile) return notifyError("Pas de fichier à remplacer");
    setLoading(true);
    try {
      const uploaded = await uploadMultipleImagesToFirebase(selectedFile, nameForFile, forder);
      const replacedImage = uploaded[0];
      const oldImage = images[index];
      const updatedImages = [...images];
      updatedImages[index] = replacedImage;
      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: updatedImages }),
      });
      if (!res.ok) throw new Error("Erreur remplacement");
      await deleteImageFromFirebase(oldImage);
      setImages(updatedImages);
      if (onSave) onSave(await res.json());
      notifySuccess("Image remplacée !");
      setSelectedFile(null);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une image
  const handleDeleteImage = async () => {
    setLoading(true);
    try {
      const updatedImages = images.filter((_, i) => i !== selectedImageIndex);
      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: updatedImages, delet }),
      });
      if (!res.ok) throw new Error("Erreur suppression");
      await deleteImageFromFirebase(images[selectedImageIndex],
        notifySuccess("Image supprimée !")
      );
      setImages(updatedImages);
      if (onSave) onSave(await res.json());

    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
        Galerie d'images
      </h3>

      {/* Image principale */}
      {images.length > 0 && (
        <div className="relative group mb-3 sm:mb-4">
          <div className="relative aspect-square bg-[var(--color-bg-primary)] rounded-lg sm:rounded-xl overflow-hidden">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={`Image ${selectedImageIndex + 1}`}
              fill
              className={`object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
              onLoadingComplete={() => setLoading(false)}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGZpbGw9IiMwMDhGRkYiIGQ9Ik0wIDBoMTAwdjEwMEgweiIvPjwvc3ZnPg==" // bleu clair
            />
          </div>

          {/* Icônes pour image sélectionnée */}
          {editable && (
            <div className="absolute top-2 right-2 flex flex-col gap-2
              opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
            >
              <button
                onClick={() => {
                  setShowConfirmDelete(true)
                }}
                className="bg-red-600 text-white rounded-full p-2"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => replacePhoto(selectedImageIndex)}
                className="bg-yellow-500 text-white rounded-full p-2"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-1 sm:pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden transition-all duration-200 ${selectedImageIndex === index
                ? "ring-2 ring-blue-500 scale-105"
                : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
            >
              <img src={img} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Uploaders */}
      {editable && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded border ${selectedUploader === "image" ? "bg-blue-600 text-[var(--color-text-primary)]" : "bg-[var(--color-bg-primary)]"
                }`}
              onClick={() => setSelectedUploader("image")}
            >
              Ajouter Image
            </button>
            <button
              className={`px-3 py-1 rounded border ${selectedUploader === "url" ? "bg-blue-600 text-[var(--color-text-primary)]" : "bg-[var(--color-bg-primary)]"
                }`}
              onClick={() => setSelectedUploader("url")}
            >
              Ajouter URL
            </button>
          </div>

          {selectedUploader === "url" && (
            <div className="flex items-center gap-2 mt-2">
              <URLUploader onUrlsChange={setSelectedImage} loading={false} />
              <button
                onClick={addNewPhotoUri}
                className="px-3 py-1 bg-green-600 text-[var(--color-text-primary)] rounded hover:bg-green-700"
              >
                Soumettre
              </button>
            </div>
          )}

          {selectedUploader === "image" && (
            <ImageUploader onImagesChange={setSelectedFile} />
          )}

          {selectedUploader === "image" && (
            <button
              onClick={addNewPhoto}
              disabled={loading || !selectedFile}
              className="mt-2 px-3 py-1 bg-blue-600 text-[var(--color-text-primary)] rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Ajouter
            </button>
          )}

          <ConfirmDialog
            isOpen={showConfirmDelete}
            title={t("common.delete")}
            message={t("common.confirmDelete")}
            confirmLabel={t("common.delete")}
            cancelLabel={t("common.cancel")}
            onConfirm={handleDeleteImage}
            onCancel={() => setShowConfirmDelete(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SimpleDataManyPhotosEditInline;
