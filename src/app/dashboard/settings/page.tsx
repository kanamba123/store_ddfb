"use client";

import { useState } from "react";
import { User, Palette, Lock, Shield, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import ProfileTab from "./components/ProfileTab";
import AppearanceTab from "./components/AppearanceTab";
import SecurityTab from "./components/SecurityTab";
import PrivacyTab from "./components/PrivacyTab";
import NotificationsTab from "./components/NotificationsTab";
import SaveButton from "./components/SaveButton";
import { InputChangeEvent } from "@/types/events";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Shared state - mis à jour avec toutes les propriétés requises
  const [settings, setSettings] = useState({
    // Profile
    name: "John Doe",
    email: "john@example.com",
    
    // Appearance
    theme: "system",
    language: "fr",
    
    // Notifications
    notifications: true,
    
    // Security
    biometricAuth: false,
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    
    // Privacy - toutes les propriétés requises par PrivacyTab
    privacyMode: false,
    dataCollection: true,
    analyticsTracking: true,
    cookieConsent: true,
    searchHistory: true,
    autoDeleteData: "never",
  });

  const handleChange = (e: InputChangeEvent) => {
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setMessage(t("settings.saveSuccess"));

    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const tabs = [
    { id: "profile", icon: User, label: t("settings.tabs.profile") },
    { id: "appearance", icon: Palette, label: t("settings.tabs.appearance") },
    { id: "security", icon: Lock, label: t("settings.tabs.security") },
    { id: "privacy", icon: Shield, label: t("settings.tabs.privacy") },
    { id: "notifications", icon: Bell, label: t("settings.tabs.notifications") },
  ];

  return (
    <div className="p-4 max-w-9xl mx-auto bg-[var(--color-bg-primary)]">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
        {t("settings.title")}
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
      <div className="bg-[var(--color-bg-primary)] p-2 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700">
        {activeTab === "profile" && <ProfileTab handleChange={handleChange} />}

        {activeTab === "appearance" && (
          <AppearanceTab settings={settings} handleChange={handleChange} />
        )}

        {activeTab === "security" && (
          <SecurityTab settings={settings} handleChange={handleChange} />
        )}

        {activeTab === "privacy" && (
          <PrivacyTab settings={settings} handleChange={handleChange} />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab settings={settings} handleChange={handleChange} />
        )}

        <SaveButton
          isSaving={isSaving}
          message={message}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}