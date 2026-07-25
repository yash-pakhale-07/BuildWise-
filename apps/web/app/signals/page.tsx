"use client";

import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { Radio, TrendingUp } from "lucide-react";

export default function SignalsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider">
          <Radio className="w-4 h-4" />
          <span>{t("sidebar.signals")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg">
          {t("signals.title")}
        </h1>
        <p className="text-fg-muted text-sm">
          {t("signals.subtitle")}
        </p>
      </div>

      {/* Signal Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            {t("signals.noveltyGauge")}
          </span>
          <div className="w-32 h-32 rounded-full border-8 border-accent mx-auto flex items-center justify-center font-extrabold text-4xl text-accent shadow-lg">
            89%
          </div>
          <p className="text-xs text-fg-muted font-medium">
            High student innovation potential detected. 14 related patent filings and IoT smart bin papers benchmarked.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            {t("signals.demandGauge")}
          </span>
          <div className="w-32 h-32 rounded-full border-8 border-success mx-auto flex items-center justify-center font-extrabold text-4xl text-success shadow-lg">
            92%
          </div>
          <p className="text-xs text-fg-muted font-medium">
            Strong publication momentum. +28% growth in IEEE Transactions on Computational Social Systems & IoT journal submissions over the last 12 months.
          </p>
        </div>
      </div>

      {/* Signal Insights List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase text-fg flex items-center gap-2 border-b border-border pb-3">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>{t("signals.trajectories")}</span>
        </h3>

        <div className="space-y-3">
          <div className="glass-card p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-fg">Campus Mess Attendance Forecasting</span>
              <span className="text-success">+38% Growth</span>
            </div>
            <p className="text-xs text-fg-muted">
              Shift from static batch cooking to LSTM neural prediction models fed by student check-in telemetry.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-fg">ESP32-CAM Smart Bin Plate-Waste Quantification</span>
              <span className="text-accent">+24% Growth</span>
            </div>
            <p className="text-xs text-fg-muted">
              Widespread adoption in IEEE IoT Journal papers focused on automated load-cell telemetry and edge computer vision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
