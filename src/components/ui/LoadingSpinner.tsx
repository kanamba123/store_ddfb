"use client";

import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
  showRetryButton?: boolean;
  onRetry?: () => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
}

/**
 * 🔄 LoadingSpinner - Composant générique pour les états :
 * - Chargement
 * - Erreur
 * - Vide
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Chargement...",
  size = 60,
  showRetryButton = false,
  onRetry,
  isLoading = false,
  isEmpty = false,
  isError = false,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <div
            className="border-4 border-t-blue-500 border-r-green-500 border-transparent rounded-full animate-spin"
            style={{ width: size, height: size }}
          />
          <p className="text-gray-700 mt-4 text-sm sm:text-base text-center font-medium">
            {text}
          </p>
        </>
      );
    }

    if (isError) {
      return (
        <>
          <p className="text-red-600 text-sm sm:text-base text-center font-semibold">
            {text}
          </p>
          {showRetryButton && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-1.5 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-600 hover:text-white transition-colors"
            >
              Réessayer
            </button>
          )}
        </>
      );
    }

    if (isEmpty) {
      return (
        <>
          <p className="text-gray-500 text-sm sm:text-base text-center">
            {text}
          </p>
          {showRetryButton && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-1.5 border border-gray-400 text-gray-600 rounded-md text-sm hover:bg-gray-100 transition-colors"
            >
              Réessayer
            </button>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50 p-6 rounded-lg text-center">
      {renderContent()}
    </div>
  );
};

export default LoadingSpinner;
