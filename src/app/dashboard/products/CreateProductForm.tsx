"use client";

import { useState } from "react";
import { VariantsProduct } from "@/types/VariantsProduct";

interface CreateProductFormProps {
  onSubmit: (formData: Partial<VariantsProduct>) => void;
  onClose: () => void;
}

export default function CreateProductForm({ onSubmit, onClose }: CreateProductFormProps) {
  const [formData, setFormData] = useState({
    variantProductName: "",
    sellingPrice: "", // Stocké comme string dans le state pour l'input
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convertir les champs numériques avant de soumettre
    const submitData = {
      ...formData,
      sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : undefined,
      stock: formData.stock ? Number(formData.stock) : undefined,
    };
    onSubmit(submitData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative dark:bg-gray-800 dark:shadow-none dark:border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Fermer modal"
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        Ajouter un produit
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="variantProductName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nom du produit
          </label>
          <input
            id="variantProductName"
            name="variantProductName"
            type="text"
            value={formData.variantProductName}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="sellingPrice"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Prix (€)
          </label>
          <input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          Ajouter produit
        </button>
      </form>
    </div>
  );
}