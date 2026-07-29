"use client";

import { mockPlansByIdea } from "../../lib/mocks";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { ProjectPlan, TechStackChoice, MilestoneItem, DatasetItem, RepoItem } from "@buildwise/shared";
import { Rocket, Cpu, ListChecks, Database, Github, Code2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ProjectHubPage() {
  const { t } = useLanguage();
  const plan: ProjectPlan = mockPlansByIdea["idea-food-waste-2026"];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
            <Rocket className="w-4 h-4" />
            <span>{t("sidebar.projecthub")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg mt-1">
            {t("plan.title")}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {t("plan.subtitle")}
          </p>
        </div>

        <Link
          href="/github"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary/90 flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <Github className="w-4 h-4" />
          <span>{t("buttons.scaffoldRepo")}</span>
        </Link>
      </div>

      {/* Architecture Visualizer Box Diagram */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-fg flex items-center gap-2">
            <Code2 className="w-5 h-5 text-accent" />
            <span>{t("plan.architectureNodes")}</span>
          </h3>
          <span className="text-xs text-fg-muted">Interactive Box Diagram</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {plan.architecture.diagramNodes?.map((node: { id: string; label: string; type: string }, idx: number) => (
            <div key={idx} className="glass-card p-4 rounded-xl text-center space-y-2 border-l-4 border-l-primary">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                {node.type}
              </span>
              <p className="text-xs font-bold text-fg leading-snug">
                {node.label}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 mt-4">
          <span className="text-xs font-bold text-fg-muted uppercase">{t("plan.dataFlow")}</span>
          <p className="text-xs text-fg leading-relaxed">
            {plan.architecture.dataFlow}
          </p>
        </div>
      </div>

      {/* Tech Stack Matrix & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack Matrix */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3">
            <Cpu className="w-5 h-5 text-secondary" />
            <span>{t("plan.techStack")}</span>
          </h3>

          <div className="space-y-3">
            {plan.techStack.map((row: TechStackChoice, idx: number) => (
              <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-accent">{row.layer}</span>
                  <span className="text-fg bg-bg px-2.5 py-1 rounded-md border border-border">
                    {row.choice}
                  </span>
                </div>
                <p className="text-xs text-fg-muted pt-1">
                  {row.why}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3">
            <ListChecks className="w-5 h-5 text-success" />
            <span>{t("plan.milestoneRoadmap")}</span>
          </h3>

          <div className="space-y-3">
            {plan.milestones.map((m: MilestoneItem, idx: number) => (
              <div key={idx} className="glass-card p-4 rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-fg">{m.title}</span>
                  </div>
                  <span className="text-[11px] text-fg-muted block">
                    Due Date: {m.dueDate} ({m.dueInDays} days)
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-muted text-accent border border-accent/30">
                  {t(`labels.${m.status === "done" ? "done" : m.status === "in_progress" ? "inProgress" : "pending"}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Datasets & Reference Repos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3">
            <Database className="w-5 h-5 text-warning" />
            <span>{t("plan.datasets")}</span>
          </h3>

          <div className="space-y-3">
            {plan.datasets.map((ds: DatasetItem, idx: number) => (
              <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                <a href={ds.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-accent hover:underline flex items-center justify-between">
                  <span>{ds.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-fg-muted" />
                </a>
                <p className="text-xs text-fg-muted">{ds.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border pb-3">
            <Github className="w-5 h-5 text-fg-muted" />
            <span>{t("plan.repos")}</span>
          </h3>

          <div className="space-y-3">
            {plan.repos.map((repo: RepoItem, idx: number) => (
              <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                <a href={repo.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-fg hover:underline flex items-center justify-between">
                  <span>{repo.name}</span>
                  <span className="text-warning">★ {repo.stars}</span>
                </a>
                <p className="text-xs text-fg-muted">{repo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
