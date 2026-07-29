"use client";

import { mockGitHubByIdea } from "../../lib/mocks";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { Github, GitPullRequest, ListChecks, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface GitHubIssueData {
  id: string;
  number: number;
  title: string;
  url: string;
  status: "done" | "in_progress" | "pending" | string;
  researchComment?: string;
}

export default function GitHubExecutionPage() {
  const { t } = useLanguage();
  const github = mockGitHubByIdea["idea-food-waste-2026"];

  const renderIssueBadge = (status: string) => {
    switch (status) {
      case "done":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-success/15 text-success border border-success/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t("labels.done")}</span>;
      case "in_progress":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-accent-muted text-accent border border-accent/30 flex items-center gap-1"><Clock className="w-3 h-3 animate-spin" /> {t("labels.inProgress")}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-warning/15 text-warning border border-warning/30 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {t("labels.pending")}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-fg-muted font-bold uppercase tracking-wider">
          <Github className="w-4 h-4 text-fg" />
          <span>{t("sidebar.github")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg">
          {t("github.title")}
        </h1>
        <p className="text-fg-muted text-sm">
          {t("github.subtitle")}
        </p>
      </div>

      {/* Repo & PR Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-primary">
          <span className="text-xs font-bold uppercase text-fg-muted">{t("github.repoLabel")}</span>
          <a
            href={github.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-accent hover:underline flex items-center gap-1.5"
          >
            <span>{github.repoUrl}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <span className="text-[11px] text-fg-muted block">Installed via GitHub App Installation Auth</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-secondary">
          <span className="text-xs font-bold uppercase text-fg-muted">{t("github.prLabel")}</span>
          <a
            href={github.starterPrUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-secondary hover:underline flex items-center gap-1.5"
          >
            <span>{github.starterPrUrl}</span>
            <GitPullRequest className="w-4 h-4" />
          </a>
          <span className="text-[11px] text-fg-muted block">Initial project scaffold & Fastify gateway PR</span>
        </div>
      </div>

      {/* Automated Milestone Issues List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-fg flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-accent" />
            <span>{t("github.issuesHeader")}</span>
          </h3>
          <span className="text-xs text-fg-muted font-semibold">
            {github.issues.length} Issues Created
          </span>
        </div>

        <div className="space-y-3">
          {github.issues.map((issue: GitHubIssueData) => (
            <div key={issue.id} className="glass-card p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-fg hover:text-accent hover:underline flex items-center gap-2"
                >
                  <span className="text-fg-muted">#{issue.number}</span>
                  <span>{issue.title}</span>
                </a>
                {renderIssueBadge(issue.status)}
              </div>

              {issue.researchComment && (
                <div className="p-2.5 rounded-lg bg-bg border border-border text-[11px] text-accent font-medium flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 shrink-0" />
                  <span>Bot Comment: {issue.researchComment}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
