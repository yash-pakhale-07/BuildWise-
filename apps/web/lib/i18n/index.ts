import en from "../../locales/en.json";
import hi from "../../locales/hi.json";
import mr from "../../locales/mr.json";

export const dictionaries = { en, hi, mr } as const;
export type Locale = keyof typeof dictionaries;

export const localeLabels: Record<Locale, { label: string; short: string }> = {
  en: { label: "English", short: "EN" },
  hi: { label: "हिन्दी (Hindi)", short: "HI" },
  mr: { label: "मराठी (Marathi)", short: "MR" },
};
