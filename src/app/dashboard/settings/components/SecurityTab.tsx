"use client";

import { Lock, Fingerprint, Key } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";

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
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const token = "FAKE_JWT_TOKEN"; // à récupérer après login

  // ✅ Toggle 2FA
  const handleToggle2FA = async (checked: boolean) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/security/toggle-2fa",
        { enabled: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServerMessage(
        res.data.twoFactorEnabled
          ? "Two-factor authentication enabled ✅"
          : "Two-factor authentication disabled ❌"
      );
    } catch (err) {
      setServerMessage("Error updating 2FA ❌");
    }
  };

  // ✅ Config biométrie (WebAuthn)
  const handleBiometricSetup = async () => {
    try {
      setBioMessage(null);

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "MyApp" },
        user: {
          id: Uint8Array.from("123456789", (c) => c.charCodeAt(0)),
          name: "john@example.com",
          displayName: "John Doe",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "direct",
      };

      const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;

      if (credential) {
        await axios.post(
          "http://localhost:4000/api/security/register-webauthn",
          { credential },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBioMessage("Biometric setup successful ✅");
      }
    } catch (error) {
      console.error(error);
      setBioMessage("Biometric setup failed ❌");
    }
  };

  // const handleBiometricSetup = async () => {
  //   if (!isAuthenticated || !user || !token) {
  //     setBioMessage("Vous devez être connecté pour activer la biométrie ❌");
  //     return;
  //   }

  //   try {
  //     setBioMessage(null);

  //     // Challenge aléatoire
  //     const challenge = new Uint8Array(32);
  //     crypto.getRandomValues(challenge);

  //     const publicKey: PublicKeyCredentialCreationOptions = {
  //       challenge,
  //       rp: { name: "win2cop" },
  //       user: {
  //         id: new TextEncoder().encode(user.id), // convertir string -> Uint8Array
  //         name: user.email,
  //         displayName: user.name,
  //       },
  //       pubKeyCredParams: [{ type: "public-key", alg: -7 }],
  //       authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
  //       timeout: 60000,
  //       attestation: "direct",
  //     };

  //     const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;

  //     if (credential) {
  //       // Convertir en format JSON sérialisable
  //       const cred = {
  //         id: credential.id,
  //         rawId: Array.from(new Uint8Array(credential.rawId)),
  //         type: credential.type,
  //         response: {
  //           attestationObject: Array.from(new Uint8Array((credential.response as any).attestationObject)),
  //           clientDataJSON: Array.from(new Uint8Array((credential.response as any).clientDataJSON)),
  //         }
  //       };

  //       await axios.post(
  //         "http://localhost:4000/api/security/register-webauthn",
  //         { credential: cred, userId: user.id },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       setBioMessage("Biometric setup successful ✅");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setBioMessage("Biometric setup failed ❌");
  //   }
  // };

  // ✅ Changer le mot de passe
  const handleChangePassword = async () => {
    try {
      if (settings.newPassword !== settings.confirmPassword) {
        setServerMessage("Passwords do not match ❌");
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/api/security/change-password",
        { currentPassword: settings.currentPassword, newPassword: settings.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServerMessage(res.data.message);
    } catch (err: any) {
      setServerMessage(err.response?.data?.error || "Password change failed ❌");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Lock size={18} /> {t("settings.tabs.security")}
      </h2>

      {/* 2FA */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{t("security.twoFactor")}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("security.twoFactorDesc")}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="twoFactorAuth"
            checked={settings.twoFactorAuth}
            onChange={(e) => {
              handleChange(e);
              handleToggle2FA(e.target.checked);
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      {/* Biometric */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-1">
            <Fingerprint size={16} /> {t("security.biometric")}
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
              if (e.target.checked) await handleBiometricSetup();
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>
      {bioMessage && <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">{bioMessage}</p>}

      {/* Change Password */}
      <div className="pt-4 border-t dark:border-gray-700">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
          <Key size={16} /> {t("security.changePassword")}
        </h3>

        <div className="space-y-4">
          <input
            name="currentPassword"
            type="password"
            value={settings.currentPassword}
            onChange={handleChange}
            placeholder={t("security.currentPassword") || ""}
            className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
          />

          <input
            name="newPassword"
            type="password"
            value={settings.newPassword}
            onChange={handleChange}
            placeholder={t("security.newPassword") || ""}
            className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
          />

          <input
            name="confirmPassword"
            type="password"
            value={settings.confirmPassword}
            onChange={handleChange}
            placeholder={t("security.confirmPassword") || ""}
            className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white"
          />

          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {t("security.changePassword")}
          </button>
        </div>
      </div>

      {serverMessage && <p className="text-xs mt-2 text-green-600">{serverMessage}</p>}
    </div>
  );
}
