"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, USE_MOCKS } from "../lib/config";
import { useLanguage } from "../lib/i18n/LanguageProvider";
import { useAuth } from "../lib/auth/AuthContext";
import { Sparkles, Lightbulb, ArrowRight, ShieldCheck, Zap, BookOpen, Layers } from "lucide-react";

export default function OverviewPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { token } = useAuth();

  const foodWasteTitle = t("content.foodWasteIdea.title");
  const foodWasteFeasibility = t("content.foodWasteIdea.feasibility");

  const [ideaText, setIdeaText] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setLoading(true);

    if (USE_MOCKS) {
      setTimeout(() => {
        setValidationResult({
          rawText: ideaText,
          feasibilityNotes: foodWasteFeasibility,
        });
        setLoading(false);
      }, 500);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/idea`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text: ideaText }),
        });
        const data = await res.json();
        setValidationResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-muted border border-accent/30 text-xs font-semibold text-accent">
          <Zap className="w-3.5 h-3.5" />
          <span>{t("app.tagline")}</span>
          {USE_MOCKS && <span className="badge-mocked px-2 py-0.5 rounded text-[10px]">{t("labels.mockedMode")}</span>}
        </div>
        <h1 className="text-3xl font-extrabold text-fg tracking-tight">
          {t("sidebar.overview")} — {foodWasteTitle}
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl">
          {t("overview.subtitle")}
        </p>
      </div>

      {/* Idea Intake Card */}
      <form onSubmit={handleValidate} className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span>{t("overview.inputLabel")}</span>
          </label>
          <span className="text-xs text-fg-muted">IEEE Xplore + GitHub Deep Search</span>
        </div>

        <textarea
          rows={3}
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          placeholder={t("overview.inputPlaceholder")}
          className="w-full bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-4 text-sm text-fg placeholder:text-fg-muted outline-none transition-all font-medium"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Real-time Signal Validation Engine</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("validation.evaluatingSignal")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t("buttons.validateNovelty")}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Validation Result Preview */}
      {validationResult && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 border-l-4 border-l-accent">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{t("validation.completed")}</span>
              <h2 className="text-xl font-bold text-fg mt-0.5">{validationResult.rawText}</h2>
            </div>
            <span className="badge-ieee px-3 py-1 rounded-full text-xs font-semibold">
              {t("validation.success")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-accent flex items-center justify-center font-bold text-xl text-accent">
                {validationResult.noveltyScore}%
              </div>
              <div>
                <span className="text-xs text-fg-muted block font-medium">{t("labels.noveltyScore")}</span>
                <span className="text-sm font-bold text-fg">High Research Potential</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-success flex items-center justify-center font-bold text-xl text-success">
                92%
              </div>
              <div>
                <span className="text-xs text-fg-muted block font-medium">{t("labels.demandScore")}</span>
                <span className="text-sm font-bold text-fg">Strong Academic Growth (+28%)</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl space-y-1.5">
            <h3 className="text-xs font-bold uppercase text-fg-muted flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{t("validation.feasibilityHeader")}</span>
            </h3>
            <p className="text-xs text-fg leading-relaxed">
              {validationResult.feasibilityNotes}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => router.push("/deepsearch")}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-accent hover:bg-accent/90 flex items-center gap-2"
            >
              <span>{t("sidebar.deepsearch")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/plan")}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-fg bg-bg-subtle border border-border hover:bg-card flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>{t("buttons.viewPlan")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
