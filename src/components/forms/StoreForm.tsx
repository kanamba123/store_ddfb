"use client";

import React, { useState } from "react";
import { StoreData, FormErrors } from "@/types/registration";

interface StoreFormProps {
  initialData?: Partial<StoreData>;
  onSubmit: (data: StoreData) => void;
  onBack?: () => void;
  loading?: boolean;
  errors?: FormErrors;
}

export const StoreForm: React.FC<StoreFormProps> = ({
  initialData = {},
  onSubmit,
  onBack,
  loading = false,
  errors = {},
}) => {
  const [formData, setFormData] = useState<StoreData>({
    storeName: initialData.storeName || "",
    storeType: initialData.storeType || "retail",
    nif: initialData.nif || "",
    rc: initialData.rc || "",
    storeAddress: initialData.storeAddress || "",
    city: initialData.city || "",
    country: initialData.country || "Burundi",
    storeContactPhone: initialData.storeContactPhone || [""],
    storeDescription: initialData.storeDescription || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.storeContactPhone!];
    newPhones[index] = value;
    setFormData((prev) => ({
      ...prev,
      storeContactPhone: newPhones,
    }));
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      storeContactPhone: [...prev.storeContactPhone!, ""],
    }));
  };

  const removePhone = (index: number) => {
    const newPhones = formData.storeContactPhone!.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      storeContactPhone: newPhones.length > 0 ? newPhones : [""],
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanData = {
      ...formData,
      storeContactPhone: formData.storeContactPhone?.filter(
        (phone) => phone.trim() !== ""
      )
    };

    onSubmit(cleanData);
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3 rounded-lg border-2 transition-all
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50 focus:border-red-500 dark:bg-red-900/20 dark:border-red-700"
        : "border-gray-200 focus:border-blue-500 focus:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:bg-gray-600"
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:ring-blue-500
    dark:placeholder-gray-400
  `;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 transition-colors duration-300">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Informations du magasin
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Configurez les détails de votre magasin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Nom du magasin *
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className={inputClasses("storeName")}
              placeholder="Nom de votre magasin"
              required
            />
            {errors.storeName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.storeName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="storeType"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Type de magasin *
            </label>
            <select
              id="storeType"
              name="storeType"
              value={formData.storeType}
              onChange={handleChange}
              className={inputClasses("storeType")}
              required
            >
              <option value="retail">Commerce de détail</option>
              <option value="wholesale">Commerce de gros</option>
              <option value="online">En ligne uniquement</option>
              <option value="physical">Physique uniquement</option>
            </select>
            {errors.storeType && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.storeType}
              </p>
            )}
          </div>
        </div>

        {/* Legal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nif"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              NIF
            </label>
            <input
              type="text"
              id="nif"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              className={inputClasses("nif")}
              placeholder="Numéro d'Identification Fiscale"
            />
          </div>

          <div>
            <label
              htmlFor="rc"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              RC
            </label>
            <input
              type="text"
              id="rc"
              name="rc"
              value={formData.rc}
              onChange={handleChange}
              className={inputClasses("rc")}
              placeholder="Registre de Commerce"
            />
          </div>

        </div>


        {/* Address */}
        <div>
          <label
            htmlFor="storeAddress"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Adresse du magasin
          </label>
          <input
            type="text"
            id="storeAddress"
            name="storeAddress"
            value={formData.storeAddress}
            onChange={handleChange}
            className={inputClasses("storeAddress")}
            placeholder="Adresse complète de votre magasin"
          />
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClasses("city")}
              placeholder="Ville"
              required
            />
            {errors.city && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Pays *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClasses("country")}
              placeholder="Pays"
              required
            />
            {errors.country && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.country}
              </p>
            )}
          </div>
        </div>

        {/* Contact Phones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Téléphones de contact
          </label>
          {formData.storeContactPhone?.map((phone, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                className={inputClasses("storeContactPhone")}
                placeholder="Numéro de téléphone"
              />
              {formData.storeContactPhone!.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhone(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  aria-label="Supprimer numéro"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPhone}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            + Ajouter un téléphone
          </button>
        </div>


     
        {/* Description */}
        <div>
          <label
            htmlFor="storeDescription"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Description du magasin
          </label>
          <textarea
            id="storeDescription"
            name="storeDescription"
            value={formData.storeDescription}
            onChange={handleChange}
            rows={4}
            className={inputClasses("storeDescription")}
            placeholder="Décrivez votre magasin, les produits vendus, etc."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Retour
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Chargement...
              </div>
            ) : (
              "Créer le magasin"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
