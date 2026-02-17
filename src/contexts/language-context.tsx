"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ru" | "ar" | "zh" | "de" | "fr";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const languages: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇴🇲",
    dir: "rtl",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    dir: "ltr",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    dir: "ltr",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    dir: "ltr",
  },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageOption: LanguageOption;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get initial language from localStorage (only runs on client)
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const savedLang = localStorage.getItem("language") as Language;
  if (savedLang && languages.some(l => l.code === savedLang)) {
    return savedLang;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language on mount
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Update document direction for RTL languages
      const langOption = languages.find(l => l.code === language);
      if (langOption) {
        document.documentElement.dir = langOption.dir || "ltr";
        document.documentElement.lang = language;
      }
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const languageOption = languages.find(l => l.code === language) || languages[0];
  const dir = languageOption.dir || "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageOption, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
