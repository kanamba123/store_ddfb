"use client";

import React, { useState } from "react";
import { OwnerData, FormErrors } from "@/types/registration";

interface OwnerFormProps {
  initialData?: Partial<OwnerData>;
  onSubmit: (data: OwnerData) => void;
  onBack?: () => void;
  loading?: boolean;
  errors?: FormErrors;
}

export const OwnerForm: React.FC<OwnerFormProps> = ({
  initialData = {},
  onSubmit,
  onBack,
  loading = false,
  errors = {},
}) => {
  const [formData, setFormData] = useState<OwnerData>({
    fullName: initialData.fullName || "",
    userName: initialData.userName || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    password: initialData.password || "",
    businessName: initialData.businessName || "",
    profil: initialData.profil || "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 transition-colors duration-300">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Informations du propriétaire
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Remplissez vos informations personnelles pour créer votre compte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Nom complet *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClasses("fullName")}
            placeholder="Entrez votre nom complet"
            required
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Nom d'utilisateur *
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={inputClasses("userName")}
            placeholder="Choisissez un nom d'utilisateur unique"
            required
          />
          {errors.userName && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.userName}
            </p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses("email")}
              placeholder="votre@email.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Téléphone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClasses("phoneNumber")}
              placeholder="75123456"
              pattern="[0-9]{8}"
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.phoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses("password")}
              placeholder="Minimum 8 caractères"
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Nom de l'entreprise
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={inputClasses("businessName")}
            placeholder="Nom de votre entreprise (optionnel)"
          />
          {errors.businessName && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <label
            htmlFor="profil"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Photo de profil (URL)
          </label>
          <input
            type="url"
            id="profil"
            name="profil"
            value={formData.profil}
            onChange={handleChange}
            className={inputClasses("profil")}
            placeholder="https://exemple.com/photo.jpg"
          />
          {errors.profil && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.profil}
            </p>
          )}
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
            {/* {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Chargement...
              </div>
            ) : (
              "Continuer"
            )} */}
            Continuer
          </button>
        </div>
      </form>
    </div>
  );
};