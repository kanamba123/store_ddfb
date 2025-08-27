"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
}

interface PreviewState {
  url: string;
  progress: number;
  isProcessing: boolean;
}

const ImageUploader = ({ onImagesChange }: ImageUploaderProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<PreviewState[]>([]);
  const [selectedImage, setSelectedImage] = useState<PreviewState | null>(null);
  const { t } = useTranslation();

  // ✅ Fonction pour redimensionner une image avec une barre de progression
  const resizeImage = (
    file: File,
    onProgress: (progress: number) => void,
    maxWidth = 800,
    maxHeight = 800
  ): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return;
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Simuler la progression de 0 → 80% pendant le dessin
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 80) {
            onProgress(progress);
          } else {
            clearInterval(interval);
          }
        }, 80);

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            clearInterval(interval);
            onProgress(100);
            resolve(new File([blob], file.name, { type: file.type }));
          }
        }, file.type);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files);

    const newPreviews: PreviewState[] = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      progress: 0,
      isProcessing: true,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    const resizedFiles: File[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const previewIndex = imagePreviews.length + i;

      const resized = await resizeImage(file, (progress) => {
        setImagePreviews((prev) =>
          prev.map((p, idx) =>
            idx === previewIndex ? { ...p, progress } : p
          )
        );
      });

      resizedFiles.push(resized);

      // ✅ Remplacer la preview par l'image finale redimensionnée
      const finalUrl = URL.createObjectURL(resized);
      setImagePreviews((prev) =>
        prev.map((p, idx) =>
          idx === previewIndex
            ? { url: finalUrl, progress: 100, isProcessing: false }
            : p
        )
      );
    }

    const updatedFiles = [...images, ...resizedFiles];
    setImages(updatedFiles);
    onImagesChange(updatedFiles);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index].url);

    setImages(newImages);
    setImagePreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {t("ImageUploader.uploadImages")}
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full p-2 text-sm border border-gray-300 rounded-lg cursor-pointer text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] dark:border-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={preview.url}
              alt={`Preview ${index}`}
              loader={() => preview.url}
              width={100}
              height={96}
              className="object-cover rounded-lg w-full h-24"
              onClick={() => setSelectedImage(preview)}
            />

            {/* ✅ Progress Bar */}
            {preview.isProcessing && (
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200">
                <div
                  className="h-2 bg-blue-500 transition-all duration-200"
                  style={{ width: `${preview.progress}%` }}
                ></div>
              </div>
            )}

            {/* ✅ X sur l'image */}
            <button
              type="button"
              className="absolute top-1 right-1 text-white bg-black/60 rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              aria-label={`Remove image ${index + 1}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Modal plein écran */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-4xl">
            <Image
              src={selectedImage.url}
              alt="Full Preview"
              loader={() => selectedImage.url}
              width={1200}
              height={800}
              className="object-contain w-full max-h-[90vh] rounded-lg"
            />

            {/* Progress bar */}
            {selectedImage.isProcessing && (
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-700">
                <div
                  className="h-2 bg-blue-500 transition-all duration-200"
                  style={{ width: `${selectedImage.progress}%` }}
                ></div>
              </div>
            )}

            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/60 rounded-full p-2 hover:bg-black transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
