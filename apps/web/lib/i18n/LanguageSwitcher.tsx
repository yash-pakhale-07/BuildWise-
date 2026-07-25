"use client";

import { useLanguage } from "./LanguageProvider";
import { dictionaries, localeLabels, Locale } from "./index";

export function CompactLanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label="Language selector"
      className="flex items-center bg-bg border border-border p-1 rounded-xl shadow-inner select-none"
    >
      {(Object.keys(dictionaries) as Locale[]).map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            role="radio"
            aria-checked={active}
            onClick={() => setLocale(l)}
            className={`flex-1 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 ${
              active
                ? "bg-accent text-white shadow-sm scale-105"
                : "text-fg-muted hover:text-fg hover:bg-card/50"
            }`}
            title={localeLabels[l].label}
          >
            {localeLabels[l].short}
          </button>
        );
      })}
    </div>
  );
}

export function FullLanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label="Full language selector"
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none"
    >
      {(Object.keys(dictionaries) as Locale[]).map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            role="radio"
            aria-checked={active}
            onClick={() => setLocale(l)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
              active
                ? "bg-accent-muted border-accent text-fg font-bold shadow-md scale-[1.02]"
                : "glass-card text-fg-muted hover:text-fg hover:border-border hover:bg-card-hover"
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-fg block">{localeLabels[l].label}</span>
              <span className="text-[10px] text-fg-muted uppercase font-semibold">
                {l === "en" ? "Default" : "iNSIGHTS Layer 2 Translated"}
              </span>
            </div>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                active ? "bg-accent text-white" : "bg-bg-subtle text-fg-muted border border-border"
              }`}
            >
              {localeLabels[l].short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
