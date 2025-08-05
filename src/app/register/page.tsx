// app/register/page.tsx
"use client";

import React, { useState } from "react";
import { OwnerForm } from "@/components/forms/OwnerForm";
import { StoreForm } from "@/components/forms/StoreForm";
import { ConfirmationStep } from "@/components/forms/ConfirmationStep";
import {
  createTemporaryOwner,
  addStoreToOwner,
} from "@/services/registrationApi";
import {
  OwnerData,
  StoreData,
  RegistrationStep,
  FormErrors,
} from "@/types/registration";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("owner");
  const [ownerData, setOwnerData] = useState<OwnerData>({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    businessName: "",
    profil: "",
  });

  const [storeData, setStoreData] = useState<StoreData>({
    storeName: "",
    storeType: "retail",
    nif: "",
    rc: "",
    bp: "",
    activitySector: "",
    taxCenter: "",
    storeAddress: "",
    city: "",
    country: "Burundi",
    storeContactPhone: [""],
    storeContactMail: "",
    personReferences: [],
    storeDescription: "",
    storePlatformUrl: [""],
    location: { latitude: 0, longitude: 0 },
    isDisplay: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [ownerId, setOwnerId] = useState<number | null>(null);

  const clearErrors = () => setErrors({});

  const handleOwnerSubmit = async (data: OwnerData) => {
    setLoading(true);
    clearErrors();

    try {
      const response = await createTemporaryOwner(data);

      if (response.success && response.data) {
        setOwnerData(response.data);
        setOwnerId(response.data.id!);
        setCurrentStep("store");
        setSuccessMessage("Propriétaire créé avec succès !");
      } else {
        setErrors({
          general:
            response.error || "Erreur lors de la création du propriétaire",
        });
      }
    } catch (error: any) {
      console.error("Erreur propriétaire:", error);
      setErrors({ general: error.message || "Erreur de connexion" });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (data: StoreData) => {
    if (!ownerId) {
      setErrors({ general: "Erreur: Aucun propriétaire trouvé" });
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      // Ajouter le magasin au propriétaire existant
      const response = await addStoreToOwner(ownerId, data);
      if (response.success && response.data) {
        setSuccessMessage(
          "🎉 Magasin créé avec succès ! Vous pouvez maintenant vous connecter."
        );
        // Optionnel: rediriger vers une page de succès ou de connexion
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setErrors({
          general: response.error || "Erreur lors de la création du magasin",
        });
      }
    } catch (error: any) {
      console.error("Erreur magasin:", error);
      setErrors({ general: error.message || "Erreur de connexion" });
    }
  };

  const handleFinalConfirmation = async () => {
    if (!ownerId) {
      setErrors({ general: "Erreur: Aucun propriétaire trouvé" });
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      // Implementation for final confirmation
    } catch (error: any) {
      console.error("Erreur magasin:", error);
      setErrors({ general: error.message || "Erreur de connexion" });
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (step: RegistrationStep) => {
    clearErrors();
    setCurrentStep(step);
  };

  const ProgressBar = () => {
    const steps = [
      { key: "owner", label: "Propriétaire", icon: "👤" },
      { key: "store", label: "Magasin", icon: "🏪" },
      { key: "confirmation", label: "Confirmation", icon: "✅" },
    ];

    const currentIndex = steps.findIndex((step) => step.key === currentStep);

    return (
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-start md:justify-center min-w-max">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-colors
                  ${
                    index <= currentIndex
                      ? "bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500"
                      : "bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600"
                  }
                `}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              <div className="ml-2 mr-2 md:mr-8 text-center">
                <p
                  className={`text-xs md:text-sm font-medium ${
                    index <= currentIndex
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-8 h-1 mx-2 md:w-16 md:mx-4 transition-colors
                    ${
                      index < currentIndex
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
            Créer votre magasin
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Rejoignez notre plateforme en quelques étapes simples. Créez votre
            compte et configurez votre magasin.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Error messages */}
        {errors.general && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400 dark:text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {errors.general}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success messages */}
        {successMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400 dark:text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step content */}
        <div className="relative">
          {currentStep === "owner" && (
            <OwnerForm
              initialData={ownerData}
              onSubmit={handleOwnerSubmit}
              loading={loading}
              errors={errors}
            />
          )}

          {currentStep === "store" && (
            <StoreForm
              initialData={storeData}
              onSubmit={handleStoreSubmit}
              onBack={() => goToStep("owner")}
              loading={loading}
              errors={errors}
            />
          )}

          {currentStep === "confirmation" && (
            <ConfirmationStep
              ownerData={ownerData}
              storeData={storeData}
              onEdit={goToStep}
              onConfirm={handleFinalConfirmation}
              loading={loading}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Vous avez déjà un compte ?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
