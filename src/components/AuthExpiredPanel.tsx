"use client";

import React from "react";
import { X } from "lucide-react";

interface AuthExpiredPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRedirect?: () => void; // callback pour redirection vers login
}

const AuthExpiredPanel: React.FC<AuthExpiredPanelProps> = ({
  isOpen,
  onClose,
  onLoginRedirect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Session expirée
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Votre session a expiré ou vous devez vous reconnecter pour continuer.
        </p>

        <button
          onClick={onLoginRedirect}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Se reconnecter
        </button>
      </div>
    </div>
  );
};

export default AuthExpiredPanel;
