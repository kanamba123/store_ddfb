"use client";

import { createContext, useContext, useEffect, useState } from "react";
import i18n from "@/app/i18n";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    
    const storedLanguage = localStorage.getItem("language");

    const cookieMatch = document.cookie.match(/(^| )userLanguage=([^;]+)/);
    const cookieLanguage = cookieMatch ? cookieMatch[2] : null;

    const browserLanguage = navigator.language.split("-")[0];

    const initialLanguage =
      storedLanguage || cookieLanguage || browserLanguage || "fr";

    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    if (i18n.language !== initialLanguage) {
      i18n.changeLanguage(initialLanguage);
    }

    setMounted(true);
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.cookie = `userLanguage=${lang};path=/;max-age=${60 * 60 * 24 * 365}`;
    document.documentElement.lang = lang;

    i18n.changeLanguage(lang);
    window.dispatchEvent(new Event("languageChanged"));
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
