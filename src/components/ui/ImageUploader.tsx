"use client"
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
}

const ImageUploader = ({ onImagesChange }: ImageUploaderProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    const updatedFiles = [...images, ...newFiles];
    const updatedPreviews = [...imagePreviews, ...newPreviews];

    setImages(updatedFiles);
    setImagePreviews(updatedPreviews);
    onImagesChange(updatedFiles);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);

    setImages(newImages);
    setImagePreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        Upload Images
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <Image
              key={index}
              src={preview}
              alt={`Preview ${index}`}
              loader={() => preview}
              width={100} 
              height={96} 
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80 transition-colors duration-200 ease-in-out"
              onClick={() => removeImage(index)}
              aria-label={`Remove image ${index + 1}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;