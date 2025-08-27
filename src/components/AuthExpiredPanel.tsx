"use client";

import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-b-blue-950 flex items-center justify-center">
      <div className="rounded-xl shadow-lg p-6 m-3 w-96 relative">
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
          aria-label={t("authExpired.close")}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">
          {t("authExpired.title")}
        </h2>
        <p className="text-sm mb-4">
          {t("authExpired.message")}
        </p>

        <button
          onClick={onLoginRedirect}
          className="w-full py-2 px-4 text-[var(--color-text-secondary)] font-medium rounded-lg transition-colors"
        >
          {t("authExpired.loginButton")}
        </button>
      </div>
    </div>
  );
};

export default AuthExpiredPanel;
