// components/forms/ConfirmationStep.tsx
"use client";

import React from "react";
import { OwnerData, StoreData } from "@/types/registration";

interface ConfirmationStepProps {
  ownerData: OwnerData;
  storeData: StoreData;
  onEdit: (step: "owner" | "store") => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  ownerData,
  storeData,
  onEdit,
  onConfirm,
  loading = false,
}) => {
  const formatPhoneNumbers = (phones?: string[]) => {
    return (
      phones?.filter((phone) => phone.trim() !== "").join(", ") ||
      "Non spécifié"
    );
  };

  const formatUrls = (urls?: string[]) => {
    return urls?.filter((url) => url.trim() !== "").join(", ") || "Aucune";
  };

  const storeTypeLabels = {
    retail: "Commerce de détail",
    wholesale: "Commerce de gros",
    online: "En ligne uniquement",
    physical: "Physique uniquement",
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-xl shadow-lg dark:shadow-gray-900/50">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2">
          Confirmation des informations
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Vérifiez vos informations avant de finaliser l'enregistrement
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Informations du propriétaire */}
        <div className="bg-[var(--color-bg-primary)] rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)]">
              Informations du propriétaire
            </h3>
            <button
              onClick={() => onEdit("owner")}
              className="px-3 py-1 sm:px-4 sm:py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm sm:text-base"
              disabled={loading}
            >
              ✏️ Modifier
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                Nom complet
              </p>
              <p className="text-[var(--color-text-primary)]">
                {ownerData.fullName}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Email
              </p>
              <p className="text-[var(--color-text-primary)]">
                {ownerData.email || "Non spécifié"}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Téléphone
              </p>
              <p className="text-[var(--color-text-primary)]">
                {ownerData.phoneNumber || "Non spécifié"}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                Mot de passe
              </p>
              <p className="text-[var(--color-text-primary)]">
                {ownerData.password ? "••••••••" : "Non défini"}
              </p>
            </div>
          </div>
        </div>

        {/* Informations du magasin */}
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold ">
              Informations du magasin
            </h3>
            <button
              onClick={() => onEdit("store")}
              className="px-3 py-1 sm:px-4 sm:py-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm sm:text-base"
              disabled={loading}
            >
              ✏️ Modifier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Informations de base */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Nom du magasin
                </p>
                <p className="text-[var(--color-text-primary)] font-medium">
                  {storeData.storeName}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Type
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {storeTypeLabels[storeData.storeType]}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Ville
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {storeData.city}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Pays
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {storeData.country}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Adresse
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {storeData.storeAddress || "Non spécifiée"}
                </p>
              </div>
            </div>

            {/* Informations légales et contact */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  NIF
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {storeData.nif || "Non spécifié"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  RC
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {storeData.rc || "Non spécifié"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Téléphones
                </p>
                <p className="text-[var(--color-text-primary)]">
                  {formatPhoneNumbers(storeData.storeContactPhone)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {storeData.storeDescription && (
            <div className="mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm font-semibold  mb-1 sm:mb-2">
                Description
              </p>
              <p className="text-[var(--color-text-primary)]  p-2 sm:p-3 rounded border dark:border-gray-600">
                {storeData.storeDescription}
              </p>
            </div>
          )}

         

         

          {/* Affichage public */}
          <div className="mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
              Affichage public
            </p>
            <p className="text-[var(--color-text-primary)]">
              {storeData.isDisplay
                ? "✅ Visible sur le site web"
                : "❌ Non visible sur le site web"}
            </p>
          </div>
        </div>

        {/* Avertissement et boutons */}
        <div className=" border-l-4 border-yellow-400 dark:border-yellow-500 p-3 sm:p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400 dark:text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] ">
                <strong>Important :</strong> Une fois confirmé, votre compte
                propriétaire et votre magasin seront créés. Vous pourrez
                modifier ces informations plus tard depuis votre tableau de
                bord.
              </p>
            </div>
          </div>
        </div>

        {/* Boutons de confirmation */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={() => onEdit("store")}
            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Retour aux informations
          </button>

          <button
            onClick={onConfirm}
            // disabled={loading}
            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {/* {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Création en cours...
              </div>
            ) : (
              "🚀 Confirmer et créer"
            )} */}
            Confirmer et créer
          </button>
        </div>
      </div>
    </div>
  );
};
