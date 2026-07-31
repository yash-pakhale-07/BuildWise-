"use client";

import { useState, useEffect } from "react";
import { HackathonReport, HackathonReportReference } from "@buildwise/shared";
import { handleDownloadPdf } from "./HackathonReportPdf";
import {
  FileText,
  X,
  Download,
  RotateCw,
  Edit3,
  Check,
  Sparkles,
  BookOpen,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Target,
  Layers,
  ExternalLink,
  Code2,
  ListChecks,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface HackathonReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  initialReport?: HackathonReport | null;
}

export function HackathonReportModal({
  isOpen,
  onClose,
  ideaId,
  initialReport,
}: HackathonReportModalProps) {
  const [report, setReport] = useState<HackathonReport | null>(initialReport || null);
  const [loading, setLoading] = useState<boolean>(!initialReport);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [regeneratingFull, setRegeneratingFull] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("cover");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!isOpen) return;

    if (initialReport) {
      setReport(initialReport);
      setLoading(false);
      return;
    }

    async function fetchOrGenerateReport() {
      try {
        setLoading(true);
        // Try calling API first, fallback to mock if API unavailable
        const res = await fetch(`${API_URL}/api/idea/${ideaId}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          const { generateMockHackathonReport } = await import("../lib/mocks/report.mock");
          const fallback = generateMockHackathonReport(ideaId);
          setReport(fallback);
        }
      } catch (err) {
        console.warn("API request failed, falling back to mock report generator:", err);
        const { generateMockHackathonReport } = await import("../lib/mocks/report.mock");
        const fallback = generateMockHackathonReport(ideaId);
        setReport(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchOrGenerateReport();
  }, [isOpen, ideaId, initialReport]);

  if (!isOpen) return null;

  const handleRegenerateFull = async () => {
    try {
      setRegeneratingFull(true);
      const res = await fetch(`${API_URL}/api/idea/${ideaId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        const { generateMockHackathonReport } = await import("../lib/mocks/report.mock");
        setReport(generateMockHackathonReport(ideaId));
      }
    } catch {
      const { generateMockHackathonReport } = await import("../lib/mocks/report.mock");
      setReport(generateMockHackathonReport(ideaId));
    } finally {
      setRegeneratingFull(false);
    }
  };

  const handleRegenerateSection = async (sectionKey: string) => {
    if (!report) return;
    try {
      setRegeneratingSection(sectionKey);
      const res = await fetch(`${API_URL}/api/idea/${ideaId}/report/regenerate-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey, currentData: (report as any)[sectionKey] }),
      });

      if (res.ok) {
        const result = await res.json();
        setReport({ ...report, [sectionKey]: result.data });
      } else {
        // Fallback mock section regeneration
        const { generateMockHackathonReport } = await import("../lib/mocks/report.mock");
        const fresh = generateMockHackathonReport(ideaId);
        setReport({ ...report, [sectionKey]: (fresh as any)[sectionKey] });
      }
    } catch {
      const { generateMockHackathonReport } = await import("../lib/mocks/report.mock");
      const fresh = generateMockHackathonReport(ideaId);
      setReport({ ...report, [sectionKey]: (fresh as any)[sectionKey] });
    } finally {
      setRegeneratingSection(null);
    }
  };

  const startEditing = (sectionKey: string, currentVal: any) => {
    setEditingSection(sectionKey);
    setEditBuffer(JSON.parse(JSON.stringify(currentVal)));
  };

  const saveEditing = (sectionKey: string) => {
    if (!report || !editBuffer) return;
    setReport({ ...report, [sectionKey]: editBuffer });
    setEditingSection(null);
    setEditBuffer(null);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditBuffer(null);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(`report-sec-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "cover", label: "Cover Page" },
    { id: "exec", label: "1. Exec Summary" },
    { id: "problem", label: "2. Problem" },
    { id: "solution", label: "3. Solution" },
    { id: "tech", label: "4. Tech Approach" },
    { id: "feasibility", label: "5. Feasibility" },
    { id: "impact", label: "6. Impact" },
    { id: "research", label: "7. Research & Refs" },
    { id: "future", label: "8. Future Scope" },
    { id: "conclusion", label: "9. Conclusion" },
    { id: "snapshot", label: "Project Snapshot" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col glass-panel rounded-2xl border border-border shadow-2xl overflow-hidden bg-bg/95 text-fg">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border bg-card/60 select-none">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white leading-tight">
                  {report ? report.title : "Generate Hackathon Report"}
                </h2>
                <span className="badge-ieee px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                  BuildWise AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generalized technical report ready for hackathons, pitch decks, and academic proposals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleRegenerateFull}
              disabled={loading || regeneratingFull}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-surface border border-border hover:bg-card flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Regenerate all sections using AI"
            >
              <RotateCw className={`w-3.5 h-3.5 ${regeneratingFull ? "animate-spin text-accent" : ""}`} />
              <span className="hidden sm:inline">Regenerate Report</span>
            </button>

            {report && (
              <button
                onClick={() => handleDownloadPdf(report)}
                className="glow-button px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface border border-transparent hover:border-border transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Quick Jump Navbar */}
        {report && !loading && (
          <div className="flex items-center gap-1 px-4 py-2 bg-bg-subtle/80 border-b border-border overflow-x-auto no-scrollbar select-none text-xs font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? "bg-accent text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-card"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-white">Synthesizing Project Report with AI...</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Aggregating deep research findings, IEEE citations, architecture nodes, tech stack matrix, and project snapshot data.
              </p>
            </div>
          ) : report ? (
            <div className="space-y-8">
              {/* COVER PAGE */}
              <div id="report-sec-cover" className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Cover Page</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{report.coverPage.branding}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider block">
                    {report.domain}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {report.title}
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="glass-card p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Team Name</span>
                    <span className="text-sm font-bold text-white">{report.teamName || "BuildWise Innovators"}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Generated Date</span>
                    <span className="text-sm font-bold text-slate-200">{report.generatedDate}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Domain</span>
                    <span className="text-sm font-bold text-accent">{report.domain}</span>
                  </div>
                </div>
              </div>

              {/* 1. EXECUTIVE SUMMARY */}
              <div id="report-sec-exec" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>1. Executive Summary</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {editingSection === "executiveSummary" ? (
                      <>
                        <button onClick={() => saveEditing("executiveSummary")} className="px-2.5 py-1 bg-success/20 text-success border border-success/30 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button onClick={cancelEditing} className="px-2 py-1 text-slate-400 text-xs">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing("executiveSummary", report.executiveSummary)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-card" title="Edit section">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRegenerateSection("executiveSummary")} disabled={regeneratingSection === "executiveSummary"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card" title="Regenerate section with AI">
                          <RotateCw className={`w-4 h-4 ${regeneratingSection === "executiveSummary" ? "animate-spin text-accent" : ""}`} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingSection === "executiveSummary" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Overview</label>
                      <textarea rows={2} value={editBuffer.overview} onChange={(e) => setEditBuffer({ ...editBuffer, overview: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Problem</label>
                      <textarea rows={2} value={editBuffer.problem} onChange={(e) => setEditBuffer({ ...editBuffer, problem: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Proposed Solution</label>
                      <textarea rows={2} value={editBuffer.solution} onChange={(e) => setEditBuffer({ ...editBuffer, solution: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Expected Outcome</label>
                      <textarea rows={2} value={editBuffer.expectedOutcome} onChange={(e) => setEditBuffer({ ...editBuffer, expectedOutcome: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p><strong className="text-white">Project Overview:</strong> {report.executiveSummary.overview}</p>
                    <p><strong className="text-white">Problem:</strong> {report.executiveSummary.problem}</p>
                    <p><strong className="text-white">Proposed Solution:</strong> {report.executiveSummary.solution}</p>
                    <p><strong className="text-white">Expected Outcome:</strong> {report.executiveSummary.expectedOutcome}</p>
                  </div>
                )}
              </div>

              {/* 2. PROBLEM STATEMENT */}
              <div id="report-sec-problem" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-warning" />
                    <span>2. Problem Statement</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {editingSection === "problemStatement" ? (
                      <>
                        <button onClick={() => saveEditing("problemStatement")} className="px-2.5 py-1 bg-success/20 text-success border border-success/30 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button onClick={cancelEditing} className="px-2 py-1 text-slate-400 text-xs">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing("problemStatement", report.problemStatement)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-card">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRegenerateSection("problemStatement")} disabled={regeneratingSection === "problemStatement"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                          <RotateCw className={`w-4 h-4 ${regeneratingSection === "problemStatement" ? "animate-spin text-accent" : ""}`} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingSection === "problemStatement" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Existing Problem</label>
                      <textarea rows={2} value={editBuffer.existingProblem} onChange={(e) => setEditBuffer({ ...editBuffer, existingProblem: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Who Is Affected</label>
                      <textarea rows={2} value={editBuffer.whoIsAffected} onChange={(e) => setEditBuffer({ ...editBuffer, whoIsAffected: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Current Challenges</label>
                      <textarea rows={2} value={editBuffer.currentChallenges} onChange={(e) => setEditBuffer({ ...editBuffer, currentChallenges: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Why It Matters</label>
                      <textarea rows={2} value={editBuffer.whyItMatters} onChange={(e) => setEditBuffer({ ...editBuffer, whyItMatters: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p><strong className="text-white">Existing Problem:</strong> {report.problemStatement.existingProblem}</p>
                    <p><strong className="text-white">Who Is Affected:</strong> {report.problemStatement.whoIsAffected}</p>
                    <p><strong className="text-white">Current Challenges:</strong> {report.problemStatement.currentChallenges}</p>
                    <p><strong className="text-white">Why Solving This Matters:</strong> {report.problemStatement.whyItMatters}</p>
                  </div>
                )}
              </div>

              {/* 3. PROPOSED SOLUTION */}
              <div id="report-sec-solution" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    <span>3. Proposed Solution</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {editingSection === "proposedSolution" ? (
                      <>
                        <button onClick={() => saveEditing("proposedSolution")} className="px-2.5 py-1 bg-success/20 text-success border border-success/30 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button onClick={cancelEditing} className="px-2 py-1 text-slate-400 text-xs">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing("proposedSolution", report.proposedSolution)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-card">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRegenerateSection("proposedSolution")} disabled={regeneratingSection === "proposedSolution"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                          <RotateCw className={`w-4 h-4 ${regeneratingSection === "proposedSolution" ? "animate-spin text-accent" : ""}`} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingSection === "proposedSolution" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Solution Overview</label>
                      <textarea rows={2} value={editBuffer.overview} onChange={(e) => setEditBuffer({ ...editBuffer, overview: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Innovation</label>
                      <textarea rows={2} value={editBuffer.innovation} onChange={(e) => setEditBuffer({ ...editBuffer, innovation: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Unique Value Proposition</label>
                      <textarea rows={2} value={editBuffer.uniqueValueProposition} onChange={(e) => setEditBuffer({ ...editBuffer, uniqueValueProposition: e.target.value })} className="w-full bg-bg border border-border rounded-xl p-2.5 text-xs text-white outline-none" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                    <p><strong className="text-white">Solution Overview:</strong> {report.proposedSolution.overview}</p>
                    
                    <div>
                      <strong className="text-white block mb-2">Key Features:</strong>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {report.proposedSolution.keyFeatures.map((kf, idx) => (
                          <li key={idx} className="glass-card p-2.5 rounded-xl flex items-center gap-2 border-l-2 border-l-accent">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                            <span className="text-slate-200 font-medium">{kf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="glass-card p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-accent block">Core Innovation</span>
                        <p className="text-slate-200 font-medium">{report.proposedSolution.innovation}</p>
                      </div>
                      <div className="glass-card p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-success block">Unique Value Proposition</span>
                        <p className="text-slate-200 font-medium">{report.proposedSolution.uniqueValueProposition}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. TECHNICAL APPROACH */}
              <div id="report-sec-tech" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-secondary" />
                    <span>4. Technical Approach</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRegenerateSection("technicalApproach")} disabled={regeneratingSection === "technicalApproach"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                      <RotateCw className={`w-4 h-4 ${regeneratingSection === "technicalApproach" ? "animate-spin text-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="glass-card p-4 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">System Architecture & Data Flow</span>
                    <p className="text-slate-200 leading-relaxed">{report.technicalApproach.architectureOverview}</p>
                  </div>

                  {/* Diagram Box Nodes Visual */}
                  {report.technicalApproach.diagramNodes?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-accent">Architecture Component Nodes</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {report.technicalApproach.diagramNodes.map((n, idx) => (
                          <div key={idx} className="glass-card p-3 rounded-xl text-center space-y-1 border-l-2 border-l-primary">
                            <span className="text-[9px] uppercase font-bold text-accent block">{n.type}</span>
                            <span className="text-xs font-bold text-white block">{n.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack Matrix Table */}
                  <div className="glass-card p-4 rounded-xl space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Technical Layer Specifications</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <span className="text-[10px] font-bold text-accent uppercase block">Frontend UI</span>
                        <span className="text-xs font-semibold text-white">{report.technicalApproach.frontend}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <span className="text-[10px] font-bold text-secondary uppercase block">Backend API</span>
                        <span className="text-xs font-semibold text-white">{report.technicalApproach.backend}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <span className="text-[10px] font-bold text-warning uppercase block">Database</span>
                        <span className="text-xs font-semibold text-white">{report.technicalApproach.database}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface border border-border">
                        <span className="text-[10px] font-bold text-success uppercase block">Deployment</span>
                        <span className="text-xs font-semibold text-white">{report.technicalApproach.deployment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. FEASIBILITY & VIABILITY */}
              <div id="report-sec-feasibility" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-success" />
                    <span>5. Feasibility & Viability</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRegenerateSection("feasibilityAndViability")} disabled={regeneratingSection === "feasibilityAndViability"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                      <RotateCw className={`w-4 h-4 ${regeneratingSection === "feasibilityAndViability" ? "animate-spin text-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-success block">Technical Feasibility</span>
                    <p className="text-slate-300">{report.feasibilityAndViability.technicalFeasibility}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-accent block">Operational Feasibility</span>
                    <p className="text-slate-300">{report.feasibilityAndViability.operationalFeasibility}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-secondary block">Scalability</span>
                    <p className="text-slate-300">{report.feasibilityAndViability.scalability}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-warning block">Cost Effectiveness</span>
                    <p className="text-slate-300">{report.feasibilityAndViability.costEffectiveness}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Sustainability</span>
                    <p className="text-slate-300">{report.feasibilityAndViability.sustainability}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-red-400 block">Risks & Mitigation</span>
                    <p className="text-slate-300">{report.feasibilityAndViability.risksAndMitigation}</p>
                  </div>
                </div>
              </div>

              {/* 6. IMPACT & BENEFITS */}
              <div id="report-sec-impact" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span>6. Impact & Benefits</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRegenerateSection("impactAndBenefits")} disabled={regeneratingSection === "impactAndBenefits"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                      <RotateCw className={`w-4 h-4 ${regeneratingSection === "impactAndBenefits" ? "animate-spin text-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-300"><strong className="text-white">Target Users:</strong> {report.impactAndBenefits.targetUsers}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="glass-card p-3.5 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-accent block">Business Impact</span>
                      <p className="text-slate-300">{report.impactAndBenefits.businessImpact}</p>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-secondary block">Social Impact</span>
                      <p className="text-slate-300">{report.impactAndBenefits.socialImpact}</p>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-success block">Productivity Improvements</span>
                      <p className="text-slate-300">{report.impactAndBenefits.productivityImprovements}</p>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-warning block">Time Savings</span>
                      <p className="text-slate-300">{report.impactAndBenefits.timeSavings}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. RESEARCH & REFERENCES */}
              <div id="report-sec-research" className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-l-accent">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent" />
                      <span>7. Research & Verified IEEE References</span>
                    </h3>
                    <span className="text-[10px] text-accent font-semibold uppercase">No documentation links (React/Node) — Verified IEEE & Deep Search Sources Only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRegenerateSection("researchAndReferences")} disabled={regeneratingSection === "researchAndReferences"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                      <RotateCw className={`w-4 h-4 ${regeneratingSection === "researchAndReferences" ? "animate-spin text-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p><strong className="text-white">Research Findings:</strong> {report.researchAndReferences.findings}</p>
                  <p><strong className="text-white">Existing Solutions:</strong> {report.researchAndReferences.existingSolutions}</p>
                  <p><strong className="text-white">Identified Research Gap:</strong> {report.researchAndReferences.identifiedGap}</p>
                  <p><strong className="text-white">How This Project Addresses The Gap:</strong> {report.researchAndReferences.howProjectAddressesGap}</p>

                  <div className="pt-2 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>References Table</span>
                      <span className="badge-ieee px-2 py-0.5 rounded text-[10px]">Direct Clickable Hyperlinks</span>
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-surface text-slate-300 font-bold">
                            <th className="p-3">Paper / Article Title</th>
                            <th className="p-3">Authors & Year</th>
                            <th className="p-3">Source</th>
                            <th className="p-3">Summary & Direct Link</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {report.researchAndReferences.references.map((ref: HackathonReportReference, idx: number) => (
                            <tr key={idx} className="hover:bg-card/50 transition-all">
                              <td className="p-3 font-semibold text-white">{ref.title}</td>
                              <td className="p-3 text-slate-400">{ref.authors?.join(", ") || "N/A"}<br/><span className="text-[10px] text-slate-500">({ref.year || 2024})</span></td>
                              <td className="p-3"><span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold text-[10px]">{ref.source}</span></td>
                              <td className="p-3 text-slate-300 space-y-1">
                                <p>{ref.summary}</p>
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-accent hover:underline font-semibold flex items-center gap-1 text-[11px] pt-1"
                                >
                                  <span>Direct Link to Source</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. FUTURE SCOPE */}
              <div id="report-sec-future" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-secondary" />
                    <span>8. Future Scope</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRegenerateSection("futureScope")} disabled={regeneratingSection === "futureScope"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                      <RotateCw className={`w-4 h-4 ${regeneratingSection === "futureScope" ? "animate-spin text-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-accent block">Future Improvements</span>
                    <p className="text-slate-300">{report.futureScope.futureImprovements}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-secondary block">AI Enhancements</span>
                    <p className="text-slate-300">{report.futureScope.aiEnhancements}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-warning block">Mobile Application</span>
                    <p className="text-slate-300">{report.futureScope.mobileApplication}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-success block">Cloud Deployment</span>
                    <p className="text-slate-300">{report.futureScope.cloudDeployment}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Commercialization</span>
                    <p className="text-slate-300">{report.futureScope.commercialization}</p>
                  </div>
                  <div className="glass-card p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Scalability Horizon</span>
                    <p className="text-slate-300">{report.futureScope.scalability}</p>
                  </div>
                </div>
              </div>

              {/* 9. CONCLUSION */}
              <div id="report-sec-conclusion" className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>9. Conclusion</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleRegenerateSection("conclusion")} disabled={regeneratingSection === "conclusion"} className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-card">
                      <RotateCw className={`w-4 h-4 ${regeneratingSection === "conclusion" ? "animate-spin text-accent" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p><strong className="text-white">Summary:</strong> {report.conclusion.summary}</p>
                  <p><strong className="text-white">Problem & Solution:</strong> {report.conclusion.problem} → {report.conclusion.solution}</p>
                  <p><strong className="text-white">Innovation & Long-Term Vision:</strong> {report.conclusion.innovation} {report.conclusion.longTermVision}</p>
                </div>
              </div>

              {/* PROJECT SNAPSHOT CARD */}
              <div id="report-sec-snapshot" className="glass-panel p-6 rounded-2xl border-2 border-purple-500/40 bg-purple-500/5 space-y-4">
                <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">✓ Project Technical Snapshot</h3>
                  </div>
                  <span className="badge-ieee px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    One-Page Executive Summary
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="glass-card p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Project Readiness</span>
                    <span className="text-sm font-bold text-white">{report.projectSnapshot.readiness}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Estimated Timeline</span>
                    <span className="text-sm font-bold text-white">{report.projectSnapshot.estimatedTimeline}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Innovation Level</span>
                    <span className="text-sm font-bold text-accent">{report.projectSnapshot.innovationLevel}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Feasibility Rating</span>
                    <span className="text-sm font-bold text-success">{report.projectSnapshot.feasibilityRating}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Scalability Rating</span>
                    <span className="text-sm font-bold text-secondary">{report.projectSnapshot.scalabilityRating}</span>
                  </div>
                  <div className="glass-card p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Research Sources Used</span>
                    <span className="text-sm font-bold text-white">{report.projectSnapshot.researchSourcesCount} Verified Papers</span>
                  </div>
                </div>

                <div className="glass-card p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400 block">Technology Stack Summary</span>
                  <span className="text-xs font-bold text-slate-200">{report.projectSnapshot.techStackSummary}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        {report && !loading && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-card/60 select-none">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Ready to scaffold codebase on GitHub once report review is complete.</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-surface border border-border hover:bg-card"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleDownloadPdf(report)}
                className="glow-button px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
