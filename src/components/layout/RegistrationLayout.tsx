"use client";

import React from "react";
import { RegistrationStep } from "@/types/registration";

interface RegistrationLayoutProps {
  children: React.ReactNode;
  currentStep: RegistrationStep;
  onStepClick?: (step: RegistrationStep) => void;
  completedSteps?: RegistrationStep[];
}

export const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  children,
  currentStep,
  onStepClick,
  completedSteps = [],
}) => {
  const steps = [
    { key: "owner" as RegistrationStep, label: "Propriétaire", icon: "👤" },
    { key: "store" as RegistrationStep, label: "Magasin", icon: "🏪" },
    { key: "confirmation" as RegistrationStep, label: "Confirmation", icon: "✅" },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
      {/* Header - Mobile First */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-4 sm:px-6 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
                Créer votre magasin
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 sm:text-base">
                Étape {currentIndex + 1} sur {steps.length}
              </p>
            </div>
            <div className="flex items-center justify-end sm:hidden">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                En cours
              </span>
            </div>
            <div className="hidden sm:flex items-center">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  En cours
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps - Mobile Optimized */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-4 sm:px-6 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.key);
              const isCurrent = step.key === currentStep;
              const isClickable = onStepClick && (isCompleted || index <= currentIndex);

              return (
                <div key={step.key} className="flex items-center">
                  {/* Mobile Step Indicator */}
                  <div className="sm:hidden flex items-center w-full">
                    <button
                      type="button"
                      disabled={!isClickable}
                      onClick={() => isClickable && onStepClick(step.key)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300"
                      }`}
                      aria-label={`Étape ${index + 1}`}
                    >
                      {isCompleted ? (
                        <span className="text-xs">✓</span>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </button>
                    <div>
                      <div className={`text-xs font-medium ${
                        isCurrent 
                          ? "text-blue-600 dark:text-blue-400" 
                          : isCompleted 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {step.label}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Step Indicator */}
                  <div className="hidden sm:flex items-center">
                    <button
                      type="button"
                      disabled={!isClickable}
                      onClick={() => isClickable && onStepClick(step.key)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300"
                      }`}
                      aria-label={`Étape ${index + 1}: ${step.label}`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        index < currentIndex 
                          ? "bg-blue-600 dark:bg-blue-400" 
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Padding */}
      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Footer - Responsive Layout */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:justify-between sm:space-y-0 sm:text-left">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Vous avez déjà un compte ?{" "}
              <a 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Se connecter
              </a>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} Votre Plateforme. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};