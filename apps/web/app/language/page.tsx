"use client";

import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { FullLanguageSwitcher } from "../../lib/i18n/LanguageSwitcher";
import { Globe } from "lucide-react";

export default function LanguagePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>{t("sidebar.language")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg">
          {t("language.title")}
        </h1>
        <p className="text-fg-muted text-sm">
          {t("language.subtitle")}
        </p>
      </div>

      {/* Language Selector Grid */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase text-fg border-b border-border pb-3">
          Supported Languages (English, Hindi, Marathi)
        </h3>
        <FullLanguageSwitcher />
      </div>
    </div>
  );
}
