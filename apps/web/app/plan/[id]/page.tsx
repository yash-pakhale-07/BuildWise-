"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectPlan, MilestoneItem, DatasetItem, RepoItem } from "@buildwise/shared";
import { Cpu, Github, GitPullRequest, ListChecks, Database, Code2, Sparkles, CheckCircle2, ExternalLink, ArrowUpRight } from "lucide-react";

export default function ProjectPlanPage() {
  const params = useParams();
  const ideaId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [scaffolding, setScaffolding] = useState(false);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [scaffoldResult, setScaffoldResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!ideaId) return;

    async function loadPlan() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/idea/${ideaId}/plan`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to generate project plan");
        const data = await res.json();
        setPlan(data);
      } catch (err: any) {
        setError(err.message || "Failed to load project plan");
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [ideaId]);

  const handleScaffoldRepo = async () => {
    if (!plan?.id) return;
    try {
      setScaffolding(true);
      const res = await fetch(`${API_URL}/api/plan/${plan.id}/github-scaffold`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to scaffold GitHub repository");
      const data = await res.json();
      setScaffoldResult(data);
    } catch (err: any) {
      setError(err.message || "GitHub scaffolding failed");
    } finally {
      setScaffolding(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>AI-Generated Technical Specification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            System Architecture & GitHub Execution Plan
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete full-stack blueprint, dataset references, and automated GitHub repository scaffolding.
          </p>
        </div>

        <button
          onClick={handleScaffoldRepo}
          disabled={scaffolding || loading || !plan}
          className="glow-button px-6 py-3 rounded-xl font-semibold text-sm text-white flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
        >
          {scaffolding ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Scaffolding Repo & PR...</span>
            </>
          ) : (
            <>
              <Github className="w-4 h-4" />
              <span>Scaffold Repo on GitHub</span>
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-semibold text-white">Generating System Architecture & Milestones...</h3>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Scaffold Result Alert */}
      {scaffoldResult && (
        <div className="glass-panel p-6 rounded-2xl border border-success/40 bg-success/5 space-y-4">
          <div className="flex items-center justify-between border-b border-success/20 pb-3">
            <div className="flex items-center gap-2 text-success font-bold text-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>GitHub Repository & PR Successfully Scaffolded!</span>
            </div>
            {scaffoldResult.__mocked && (
              <span className="badge-mocked px-2.5 py-1 rounded-full text-xs font-medium">
                __mocked GitHub App Action
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl space-y-2">
              <span className="text-xs text-slate-400 font-medium uppercase">Created Repository</span>
              <a
                href={scaffoldResult.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold hover:underline flex items-center gap-1.5"
              >
                <span>{scaffoldResult.repoUrl}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-2">
              <span className="text-xs text-slate-400 font-medium uppercase">Starter Pull Request</span>
              <a
                href={scaffoldResult.starterPrUrl}
                target="_blank"
                rel="noreferrer"
                className="text-secondary font-semibold hover:underline flex items-center gap-1.5"
              >
                <span>{scaffoldResult.starterPrUrl}</span>
                <GitPullRequest className="w-4 h-4 text-secondary" />
              </a>
            </div>
          </div>
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-8">
          {/* Architecture Visualizer Box Diagram */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-accent" />
                <span>Architecture Diagram & Data Flow</span>
              </h3>
              <span className="text-xs text-slate-400">Box-Diagram Component</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {plan.architecture.diagramNodes?.map((node, idx) => (
                <div key={idx} className="glass-card p-4 rounded-xl text-center space-y-2 relative border-l-4 border-l-primary">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                    {node.type}
                  </span>
                  <p className="text-xs font-bold text-white leading-snug">
                    {node.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="glass-card p-4 rounded-xl space-y-1 mt-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Data Flow Narrative</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {plan.architecture.dataFlow}
              </p>
            </div>
          </div>

          {/* Tech Stack Table & Milestone Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tech Stack Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-3">
                <Cpu className="w-5 h-5 text-secondary" />
                <span>Recommended Tech Stack Matrix</span>
              </h3>

              <div className="space-y-3">
                {plan.techStack?.map((row, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-accent">{row.layer}</span>
                      <span className="text-slate-200 font-bold bg-surface/90 px-2.5 py-1 rounded-md border border-border">
                        {row.choice}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pt-1">
                      {row.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-3">
                <ListChecks className="w-5 h-5 text-success" />
                <span>Milestone Execution Timeline</span>
              </h3>

              <div className="space-y-3">
                {plan.milestones?.map((m: MilestoneItem, idx: number) => (
                  <div key={idx} className="glass-card p-4 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{m.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        Due in {m.dueInDays || 7} days
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                      {m.status || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Datasets & Repos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datasets */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-3">
                <Database className="w-5 h-5 text-warning" />
                <span>Recommended Research Datasets</span>
              </h3>

              <div className="space-y-3">
                {plan.datasets?.map((ds: DatasetItem, idx: number) => (
                  <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                    <a href={ds.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline flex items-center justify-between">
                      <span>{ds.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                    <p className="text-xs text-slate-400">{ds.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Repos */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-3">
                <Github className="w-5 h-5 text-slate-300" />
                <span>Open Source Baseline Repositories</span>
              </h3>

              <div className="space-y-3">
                {plan.repos?.map((repo: RepoItem, idx: number) => (
                  <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                    <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-200 hover:underline flex items-center justify-between">
                      <span>{repo.name}</span>
                      <span className="text-xs text-warning">★ {repo.stars || 0}</span>
                    </a>
                    <p className="text-xs text-slate-400">{repo.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
