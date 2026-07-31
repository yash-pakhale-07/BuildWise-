"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Idea, AgentInteraction } from "@buildwise/shared";
import { LayoutDashboard, Sparkles, Github, GitPullRequest, ArrowRight, Activity, Clock, FileText } from "lucide-react";
import { API_BASE_URL } from "../../lib/config";
import { useAuth } from "../../lib/auth/AuthContext";
import { useLanguage } from "../../lib/i18n/LanguageProvider";

interface DashboardData {
  ideasCount: number;
  plansCount: number;
  githubReposCount: number;
  ideas: Array<Idea & { raw_text?: string }>;
  githubLinks: Array<{ repo_url?: string; repoUrl?: string; starter_pr_url?: string; starterPrUrl?: string }>;
  interactions: AgentInteraction[];
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    async function loadDashboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error("Failed to load dashboard data");
        setDashboard(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      }
    }
    loadDashboard();
  }, [token]);

  const ideas = dashboard?.ideas ?? [];
  const repo = dashboard?.githubLinks[0];
  const repoUrl = repo?.repo_url || repo?.repoUrl;
  const starterPrUrl = repo?.starter_pr_url || repo?.starterPrUrl;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scaffolded": return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-success/15 text-success border border-success/30">{t("labels.done")}</span>;
      case "planned": return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-muted text-accent border border-accent/30">{t("labels.inProgress")}</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-warning/15 text-warning border border-warning/30">{t("labels.pending")}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary font-bold uppercase tracking-wider"><LayoutDashboard className="w-4 h-4" /><span>{t("sidebar.dashboard")}</span></div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg mt-1">{t("dashboard.title")}</h1>
          <p className="text-fg-muted text-sm mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <Link href="/" className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary/90 flex items-center gap-2 self-start sm:self-auto shadow-sm"><Sparkles className="w-4 h-4" /><span>{t("buttons.newIdea")}</span></Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-1"><span className="text-xs font-bold text-fg-muted uppercase">{t("dashboard.statIdeas")}</span><div className="text-3xl font-extrabold text-fg">{dashboard?.ideasCount ?? 0}</div></div>
        <div className="glass-card p-6 rounded-2xl space-y-1"><span className="text-xs font-bold text-fg-muted uppercase">{t("dashboard.statPlans")}</span><div className="text-3xl font-extrabold text-accent">{dashboard?.plansCount ?? 0}</div></div>
        <div className="glass-card p-6 rounded-2xl space-y-1"><span className="text-xs font-bold text-fg-muted uppercase">{t("dashboard.statRepos")}</span><div className="text-3xl font-extrabold text-success">{dashboard?.githubReposCount ?? 0}</div></div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3"><FileText className="w-5 h-5 text-primary" /><span>{t("dashboard.pipelineHeader")}</span></h3>
        <div className="space-y-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && ideas.length === 0 && <p className="text-sm text-fg-muted">No research ideas yet. Create your first research idea to get started.</p>}
          {ideas.map((idea) => (
            <div key={idea.id} className="glass-card p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl"><div className="flex items-center gap-3">{getStatusBadge(idea.status)}<span className="text-xs text-fg-muted">{t("labels.noveltyScore")}: <strong className="text-fg">{idea.noveltyScore ?? 0}%</strong></span></div><p className="text-xs font-bold text-fg line-clamp-2">{idea.raw_text || idea.rawText}</p></div>
              <div className="flex items-center gap-2.5 self-end md:self-auto"><Link href={`/workspace/${idea.id}`} className="px-3.5 py-1.5 rounded-lg bg-bg border border-border text-xs font-semibold text-fg-muted hover:text-fg transition-colors">{t("sidebar.deepsearch")}</Link><Link href={`/plan/${idea.id}`} className="px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"><span>{t("buttons.viewPlan")}</span><ArrowRight className="w-3.5 h-3.5" /></Link></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4"><h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3"><Github className="w-5 h-5 text-fg-muted" /><span>{t("dashboard.activeRepoHeader")}</span></h3>{repoUrl && starterPrUrl ? <div className="glass-card p-4 rounded-xl space-y-3"><div className="flex items-center justify-between text-xs"><a href={repoUrl} target="_blank" rel="noreferrer" className="text-accent font-bold hover:underline">{repoUrl}</a></div><div className="flex items-center justify-between text-xs text-fg-muted border-t border-border pt-2"><a href={starterPrUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline flex items-center gap-1 font-semibold"><GitPullRequest className="w-3.5 h-3.5 text-secondary" /><span>Starter PR Open</span></a><span className="text-[10px] uppercase font-bold text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded-full">{t("labels.installed")}</span></div></div> : <p className="text-sm text-fg-muted">No scaffolded repositories yet.</p>}</div>
        <div className="glass-panel p-6 rounded-2xl space-y-4"><h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3"><Activity className="w-5 h-5 text-accent" /><span>{t("dashboard.agentActivityHeader")}</span></h3><div className="space-y-2">{(dashboard?.interactions ?? []).slice(-3).map((inter) => <div key={inter.id} className="glass-card p-3 rounded-xl space-y-1 text-xs"><div className="flex items-center justify-between text-[10px]"><span className="font-bold text-accent uppercase tracking-wider">{inter.channel} ({inter.direction})</span><span className="text-fg-muted flex items-center gap-1"><Clock className="w-3 h-3" /><span>{new Date(inter.createdAt || Date.now()).toLocaleTimeString()}</span></span></div><p className="text-fg text-[11px] leading-snug">{inter.message}</p></div>)}{(dashboard?.interactions ?? []).length === 0 && <p className="text-sm text-fg-muted">No agent activity yet.</p>}</div></div>
      </div>
    </div>
  );
}
