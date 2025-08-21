"use client";

import { Lock, Fingerprint, Key } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface SecurityTabProps {
  settings: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SecurityTab({ settings, handleChange }: SecurityTabProps) {
  const { t } = useTranslation();
  const [bioMessage, setBioMessage] = useState<string | null>(null);

  // Fonction pour configurer l’auth biométrique
  const handleBiometricSetup = async () => {
    try {
      setBioMessage(null);

      // Challenge envoyé normalement par le backend (ici on simule)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "MonApplication" },
        user: {
          id: Uint8Array.from("123456789", c => c.charCodeAt(0)),
          name: "john@example.com",
          displayName: "John Doe",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }], // -7 = "ES256"
        authenticatorSelection: {
          authenticatorAttachment: "platform", // smartphone/ordi avec biométrie intégrée
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct",
      };

      const credential = await navigator.credentials.create({ publicKey });

      if (credential) {
        setBioMessage("Biométrie configurée avec succès ✅");
        console.log("Credential WebAuthn =>", credential);
      }
    } catch (error) {
      console.error(error);
      setBioMessage("Échec de la configuration biométrique ❌");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Lock size={18} />
        {t("settings.tabs.security")}
      </h2>

      <div className="space-y-4">
        {/* 2FA */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">
              {t("security.twoFactor")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("security.twoFactorDesc")}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        {/* Biometric Auth */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Fingerprint size={16} />
              {t("security.biometric")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("security.biometricDesc")}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="biometricAuth"
              checked={settings.biometricAuth}
              onChange={async (e) => {
                handleChange(e);
                if (e.target.checked) {
                  await handleBiometricSetup();
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
        {bioMessage && (
          <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">{bioMessage}</p>
        )}

        {/* Change password */}
        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
            <Key size={16} />
            {t("security.changePassword")}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("security.currentPassword")}
              </label>
              <input
                name="currentPassword"
                type="password"
                value={settings.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("security.newPassword")}
              </label>
              <input
                name="newPassword"
                type="password"
                value={settings.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("security.confirmPassword")}
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={settings.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
