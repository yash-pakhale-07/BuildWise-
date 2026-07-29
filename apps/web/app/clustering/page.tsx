"use client";

import { mockClustersByIdea } from "../../lib/mocks";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { SearchResult, Cluster } from "@buildwise/shared";
import { Network, ExternalLink } from "lucide-react";

export default function ClusteringPage() {
  const { t } = useLanguage();
  const clusters: Cluster[] = mockClustersByIdea["idea-food-waste-2026"] || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-secondary font-bold uppercase tracking-wider">
          <Network className="w-4 h-4" />
          <span>{t("sidebar.clustering")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg">
          {t("clustering.title")}
        </h1>
        <p className="text-fg-muted text-sm">
          {t("clustering.subtitle")}
        </p>
      </div>

      {/* 4 Cluster Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((cluster: Cluster) => {
          const isGapCluster = cluster.type === "gaps";
          const summaryText = isGapCluster ? t("content.foodWasteIdea.gapSummary") : cluster.summary;
          const labelKey = `labels.${cluster.type === "existing_solutions" ? "existingSolutions" : cluster.type === "academic" ? "academicApproaches" : cluster.type === "oss" ? "openSourceImplementations" : "gaps"}`;
          const localizedLabel = t(labelKey);

          return (
            <div key={cluster.id || cluster.type} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between border-t-4 border-t-secondary">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                    {localizedLabel}
                  </span>
                  <span className="text-[10px] text-fg-muted uppercase font-semibold">
                    {cluster.sources?.length || 0} Sources Tagged
                  </span>
                </div>

                <p className="text-fg text-xs font-medium leading-relaxed">
                  {summaryText}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <h4 className="text-[11px] font-bold uppercase text-fg-muted tracking-wider">
                  {t("clustering.nestedReferences")}
                </h4>

                <div className="space-y-2">
                  {cluster.sources?.map((src: SearchResult, sIdx: number) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-bg border border-border text-xs space-y-1 hover:border-accent transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-fg hover:text-accent hover:underline line-clamp-1 flex items-center gap-1 text-xs"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-3 h-3 text-fg-muted" />
                        </a>
                      </div>
                      <p className="text-fg-muted text-[11px] line-clamp-2">
                        {src.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
