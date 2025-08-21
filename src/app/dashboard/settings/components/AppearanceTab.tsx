"use client";

import { Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import i18n from '@/app/i18n';

interface AppearanceTabProps {
  settings: {
    theme: string;
    language: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AppearanceTab({
  settings,
  handleChange,
}: AppearanceTabProps) {
  const themeContext = useTheme();
  const languageContext = useLanguage();

  const changeTheme = themeContext?.changeTheme || ((theme: string) => {
    console.warn("ThemeContext not available");
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  });

  const changeLanguage = languageContext?.changeLanguage || ((lang: string) => {
    console.warn("LanguageContext not available");
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    
    // Synchroniser avec i18next même si le contexte n'est pas disponible
    i18n.changeLanguage(lang);
  });

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    changeTheme(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    handleChange(e);
    changeLanguage(newLanguage);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
        <Palette size={18} />
        Apparence
      </h2>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
          Thème
        </label>
        <select
          name="theme"
          value={settings.theme}
          onChange={handleThemeChange}
          className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border rounded-lg focus:ring focus:ring-blue-200 "
        >
          <option value="system">Système</option>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
          Langue
        </label>
        <select
          name="language"
          value={settings.language}
          onChange={handleLanguageChange}
          className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border rounded-lg focus:ring focus:ring-blue-200 "
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="kr">Ikirundi</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
}