"use client";

import React from "react";
import { X, AlertCircle, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthExpiredPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRedirect?: () => void;
}

const AuthExpiredPanel: React.FC<AuthExpiredPanelProps> = ({
  isOpen,
  onClose,
  onLoginRedirect,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl shadow-lg p-6 m-3 w-96 relative bg-[var(--color-bg-primary)] border border-red-400">
        {/* Bouton fermer */}
        <button
          className="absolute top-2 right-2 text-[var(--color-text-primary)] hover:text-red-500 transition-colors"
          onClick={onClose}
          aria-label={t("authExpired.close")}
        >
          <X size={20} />
        </button>

        {/* Icône d'alerte */}
        <div className="flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-500" />
        </div>

        <h2 className="text-lg font-semibold mb-2 text-center text-[var(--color-text-primary)]">
          {t("authExpired.title")}
        </h2>
        <p className="text-sm mb-4 text-[var(--color-text-secondary)] text-center">
          {t("authExpired.message")}
        </p>

        <button
          onClick={onLoginRedirect}
          className="w-full py-2 px-4 text-[var(--color-text-primary)] font-medium rounded-lg   hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          {t("authExpired.loginButton")}
        </button>
      </div>
    </div>
  );
};

export default AuthExpiredPanel;
