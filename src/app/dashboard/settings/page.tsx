"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Lock,
  Fingerprint,
  Globe,
  Shield,
  Bell,
  User,
  Palette,
  Key,
} from "lucide-react";

export default function SettingsPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // User settings state
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john@example.com",
    theme: "system", // 'light' | 'dark' | 'system'
    language: "fr",
    notifications: true,
    biometricAuth: false,
    twoFactorAuth: false,
    privacyMode: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setMessage("Paramètres sauvegardés avec succès !");

    // Apply theme immediately
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Tab components
  const tabs = [
    { id: "profile", icon: User, label: "Profil" },
    { id: "appearance", icon: Palette, label: "Apparence" },
    { id: "security", icon: Lock, label: "Sécurité" },
    { id: "privacy", icon: Shield, label: "Confidentialité" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <div className="p-6 max-w-9xl mx-auto dark:bg-gray-900 ">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Paramètres
      </h1>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <User size={18} />
              Informations du profil
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                name="name"
                type="text"
                value={settings.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500/30"
              />
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Palette size={18} />
              Apparence
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thème
              </label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="system">Système</option>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Langue
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Lock size={18} />
              Sécurité
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Authentification à deux facteurs
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ajoutez une couche de sécurité supplémentaire
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Fingerprint size={16} />
                    Authentification biométrique
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Utilisez votre empreinte digitale ou reconnaissance faciale
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="biometricAuth"
                    checked={settings.biometricAuth}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
                  <Key size={16} />
                  Changer le mot de passe
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      name="currentPassword"
                      type="password"
                      value={settings.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      name="newPassword"
                      type="password"
                      value={settings.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={settings.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Shield size={18} />
              Confidentialité
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mode privé
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Limite le suivi et le stockage des données
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyMode"
                    checked={settings.privacyMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Gestion des données
                </h3>

                <div className="space-y-3">
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Exporter mes données
                  </button>

                  <button className="text-red-600 dark:text-red-400 text-sm font-medium">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Bell size={18} />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Activer les notifications
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recevez des alertes et mises à jour
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Save Button (shown on all tabs) */}
        <div className="mt-8 pt-6 border-t dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sauvegarde en cours...
              </>
            ) : (
              "Sauvegarder les paramètres"
            )}
          </button>

          {message && (
            <p className="mt-4 text-green-600 dark:text-green-400 font-medium text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
