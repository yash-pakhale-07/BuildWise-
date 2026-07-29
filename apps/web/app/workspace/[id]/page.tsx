"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Cluster, SearchResult } from "@buildwise/shared";
import { BookOpen, Github, Globe, Sparkles, ArrowRight, Layers, ExternalLink, UserCheck, AlertTriangle } from "lucide-react";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const ideaId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!ideaId) return;

    async function loadResearch() {
      try {
        setLoading(true);
        // Trigger background research job
        await fetch(`${API_URL}/api/idea/${ideaId}/research`, { method: "POST" });
        // Fetch current status and clusters
        const res = await fetch(`${API_URL}/api/idea/${ideaId}/research/status`);
        if (!res.ok) throw new Error("Failed to fetch research status");
        const data = await res.json();
        setClusters(data.clusters || []);
      } catch (err: any) {
        setError(err.message || "Failed to load research workspace");
      } finally {
        setLoading(false);
      }
    }

    loadResearch();
  }, [ideaId]);

  const handleGeneratePlan = async () => {
    router.push(`/plan/${ideaId}`);
  };

  const renderSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "ieee_xplore":
        return <BookOpen className="w-4 h-4 text-accent" />;
      case "github":
        return <Github className="w-4 h-4 text-slate-300" />;
      default:
        return <Globe className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-accent font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Research Knowledge Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            IEEE Literature & Open Source Research Clusters
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Deep-searched & synthesized by iNSIGHTS Layer 2 across IEEE Xplore, GitHub, and academic repositories.
          </p>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="glow-button px-6 py-3 rounded-xl font-semibold text-sm text-white flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
        >
          <span>Generate Project Plan & Architecture</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading && (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-semibold text-white">Synthesizing IEEE Xplore Papers & Knowledge Clusters...</h3>
          <p className="text-sm text-slate-400">Querying DOIs, GitHub repos, and identifying student research gaps.</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clusters.map((cluster, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                    {cluster.type.replace("_", " ")}
                  </span>
                  {cluster.__mocked && (
                    <span className="badge-mocked px-2 py-0.5 rounded text-[10px] font-medium">
                      __mocked
                    </span>
                  )}
                </div>

                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  {cluster.summary}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/60">
                <h4 className="text-xs font-semibold uppercase text-slate-400">Cited Sources & References</h4>
                <div className="space-y-2">
                  {cluster.sources?.map((src: SearchResult, sIdx: number) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-surface/80 border border-border/80 text-xs space-y-1.5 hover:border-slate-500 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold text-slate-200">
                          {renderSourceIcon(src.sourceType)}
                          <a href={src.url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 line-clamp-1">
                            {src.title}
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        </div>
                        {src.sourceType === "ieee_xplore" && (
                          <span className="badge-ieee px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap">
                            IEEE Citation
                          </span>
                        )}
                      </div>

                      <p className="text-slate-400 line-clamp-2 text-[11px]">
                        {src.snippet}
                      </p>

                      {src.meta && (
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-border/40">
                          {src.meta.doi && <span>DOI: <strong className="text-slate-300">{src.meta.doi}</strong></span>}
                          {src.meta.venue && <span>Venue: <strong className="text-slate-300">{src.meta.venue}</strong></span>}
                          {src.meta.year && <span>Year: <strong className="text-slate-300">{src.meta.year}</strong></span>}
                          {src.meta.stars && <span>Stars: <strong className="text-slate-300">★ {src.meta.stars}</strong></span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
