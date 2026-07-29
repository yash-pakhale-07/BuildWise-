"use client";

import { useState } from "react";
import { mockClustersByIdea } from "../../lib/mocks";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { SearchResult, Cluster } from "@buildwise/shared";
import { Search, ExternalLink, Filter } from "lucide-react";

export default function DeepSearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("College Hostel Food Waste AI");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const clusters: Cluster[] = mockClustersByIdea["idea-food-waste-2026"] || [];
  const allSources: SearchResult[] = clusters.flatMap((c: Cluster) => c.sources || []);

  const filteredSources: SearchResult[] = allSources.filter((src: SearchResult) => {
    if (activeFilter === "all") return true;
    return src.sourceType === activeFilter;
  });

  const renderSourceBadge = (sourceType: string) => {
    switch (sourceType) {
      case "ieee_xplore":
        return <span className="badge-ieee px-2 py-0.5 rounded text-[10px] font-bold">IEEE Xplore</span>;
      case "github":
        return <span className="bg-bg-subtle border border-border px-2 py-0.5 rounded text-[10px] font-bold text-fg">GitHub</span>;
      case "arxiv":
        return <span className="bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-purple-400">arXiv</span>;
      default:
        return <span className="bg-slate-500/10 border border-slate-500/30 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400">Web</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>{t("sidebar.deepsearch")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg">
          {t("deepsearch.title")}
        </h1>
        <p className="text-fg-muted text-sm">
          {t("deepsearch.subtitle")}
        </p>
      </div>

      {/* Interactive Search Bar & Filters */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-fg-muted absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("deepsearch.placeholder")}
            className="w-full bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl pl-11 pr-4 py-2.5 text-xs font-medium text-fg outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
          <span className="text-xs text-fg-muted font-semibold mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Source:
          </span>
          {[
            { id: "all", label: t("deepsearch.filterAll") },
            { id: "ieee_xplore", label: t("deepsearch.filterIEEE") },
            { id: "github", label: t("deepsearch.filterGitHub") },
            { id: "web", label: t("deepsearch.filterWeb") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? "bg-accent text-white shadow-sm"
                  : "bg-bg-subtle border border-border text-fg-muted hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results List */}
      <div className="space-y-3">
        {filteredSources.map((src: SearchResult, idx: number) => (
          <div key={idx} className="glass-card p-5 rounded-xl space-y-2 border-l-4 border-l-accent hover:border-accent transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {renderSourceBadge(src.sourceType)}
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-fg hover:text-accent hover:underline flex items-center gap-1.5 line-clamp-1"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-fg-muted" />
                </a>
              </div>
            </div>

            <p className="text-xs text-fg-muted leading-relaxed">
              {src.snippet}
            </p>

            {src.meta && (
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-fg-muted pt-2 border-t border-border/60">
                {src.meta.doi && (
                  <span>
                    DOI: <strong className="text-accent">{src.meta.doi}</strong>
                  </span>
                )}
                {src.meta.venue && (
                  <span>
                    Venue: <strong className="text-fg">{src.meta.venue}</strong>
                  </span>
                )}
                {src.meta.authors && (
                  <span>
                    Authors: <strong className="text-fg">{src.meta.authors.join(", ")}</strong>
                  </span>
                )}
                {src.meta.year && (
                  <span>
                    Year: <strong className="text-fg">{src.meta.year}</strong>
                  </span>
                )}
                {src.meta.stars && (
                  <span className="text-warning font-semibold">
                    ★ {src.meta.stars} stars
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
