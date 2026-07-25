"use client";

import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { Settings, Key, Radio } from "lucide-react";
import { USE_MOCKS } from "../../lib/config";

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-fg-muted font-bold uppercase tracking-wider">
          <Settings className="w-4 h-4 text-fg" />
          <span>{t("sidebar.settings")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg">
          {t("settings.title")}
        </h1>
        <p className="text-fg-muted text-sm">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Mock Mode Status Panel */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-l-warning">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-fg text-sm">
            <Radio className="w-4 h-4 text-warning" />
            <span>{t("settings.execMode")}</span>
          </div>
          <span className="badge-mocked px-3 py-1 rounded-full text-xs font-bold">
            USE_MOCKS = {USE_MOCKS ? "true" : "false"}
          </span>
        </div>
        <p className="text-xs text-fg-muted leading-relaxed">
          The application is currently operating in <strong>Frontend-First Mocked Mode</strong> using golden-path data fixtures. To connect to live Fastify backend endpoints, toggle <code>USE_MOCKS = false</code> in <code>apps/web/lib/config.ts</code>.
        </p>
      </div>

      {/* API Credentials Status */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase text-fg border-b border-border pb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-accent" />
          <span>{t("settings.apiIntegrations")}</span>
        </h3>

        <div className="space-y-3">
          {[
            { name: "iNSIGHTS Layer 2 API Key", env: "INSIGHTS_LAYER2_API_KEY", status: "Mock Fallback Active" },
            { name: "IEEE Xplore Search API Key", env: "IEEE_XPLORE_API_KEY", status: "Mock Fallback Active" },
            { name: "GitHub App Private Key", env: "GITHUB_APP_PRIVATE_KEY", status: "Mock Fallback Active" },
            { name: "Telegram Bot Token", env: "TELEGRAM_BOT_TOKEN", status: "Mock Fallback Active" },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-fg block">{item.name}</span>
                <span className="text-[10px] text-fg-muted font-mono">{item.env}</span>
              </div>

              <span className="badge-mocked px-2.5 py-1 rounded-full text-[10px] font-bold">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
