"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, Locale } from "./index";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function getNestedValue(obj: any, path: string): string | null {
  if (!obj || !path) return null;
  const keys = path.split(".");
  let current = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return null;
    }
  }
  return typeof current === "string" ? current : null;
}

function humanizeKey(key: string): string {
  const parts = key.split(".");
  const lastPart = parts[parts.length - 1] || key;
  // Convert camelCase or dot strings to Title Case
  const formatted = lastPart
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && dictionaries[saved]) setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  const t = (key: string): string => {
    if (!key) return "";

    // 1. Try currently selected locale
    const localizedVal = getNestedValue(dictionaries[locale], key);
    if (localizedVal) return localizedVal;

    // 2. Fallback to English locale
    const fallbackVal = getNestedValue(dictionaries.en, key);
    if (fallbackVal) return fallbackVal;

    // 3. Guaranteed human-readable fallback (never leak dot-notation strings to UI)
    return humanizeKey(key);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
