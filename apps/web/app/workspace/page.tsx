"use client";

import { mockClustersByIdea } from "../../lib/mocks";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { Cluster, SearchResult } from "@buildwise/shared";
import { BookOpen, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResearchWorkspaceAggregatorPage() {
  const { t } = useLanguage();
  const clusters: Cluster[] = mockClustersByIdea["idea-food-waste-2026"] || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{t("sidebar.workspace")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg mt-1">
            Student Academic Knowledge Index
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            Unified view of active IEEE papers, open-source code repositories, and identified research gaps.
          </p>
        </div>

        <Link
          href="/plan"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-accent hover:bg-accent/90 flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <span>{t("buttons.openProjectHub")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Aggregated Cluster Summaries */}
      <div className="space-y-4">
        {clusters.map((c: Cluster) => {
          const isGap = c.type === "gaps";
          const summaryText = isGap ? t("content.foodWasteIdea.gapSummary") : c.summary;
          const labelKey = `labels.${c.type === "existing_solutions" ? "existingSolutions" : c.type === "academic" ? "academicApproaches" : c.type === "oss" ? "openSourceImplementations" : "gaps"}`;
          const localizedLabel = t(labelKey);

          return (
            <div key={c.id || c.type} className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent border border-accent/30 bg-accent-muted px-3 py-1 rounded-full">
                  {localizedLabel}
                </span>
                <span className="text-xs text-fg-muted">
                  {c.sources?.length || 0} Grounded References
                </span>
              </div>

              <p className="text-sm font-semibold text-fg leading-relaxed">
                {summaryText}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {c.sources?.map((src: SearchResult, idx: number) => (
                  <div key={idx} className="glass-card p-3 rounded-xl space-y-1">
                    <a href={src.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-fg hover:text-accent flex items-center justify-between">
                      <span className="line-clamp-1">{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                    </a>
                    <p className="text-[11px] text-fg-muted line-clamp-2">{src.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
