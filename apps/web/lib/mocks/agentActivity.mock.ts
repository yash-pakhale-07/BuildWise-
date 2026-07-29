import { AgentInteraction } from "@buildwise/shared";

export const mockAgentActivity: AgentInteraction[] = [
  {
    id: "inter-1",
    channel: "telegram",
    message: "/start",
    direction: "inbound",
    createdAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "inter-2",
    channel: "telegram",
    message: "👋 Welcome to BuildWise Research Copilot! Send me your research queries or ask questions about your active project plan specification.",
    direction: "outbound",
    createdAt: "2026-07-24T10:00:02Z",
  },
  {
    id: "inter-3",
    channel: "telegram",
    message: "What is the recommended compression ratio for satellite edge ML?",
    direction: "inbound",
    createdAt: "2026-07-24T10:05:12Z",
  },
  {
    id: "inter-4",
    channel: "telegram",
    message: "💡 Based on your active IEEE-grounded specification (IEEE Trans. Geoscience DOI: 10.1109/TGRS.2022.3190821), recommended target compression is 18:1 sub-vector quantization with sub-50ms latency.",
    direction: "outbound",
    createdAt: "2026-07-24T10:05:15Z",
  },
  {
    id: "inter-5",
    channel: "telegram",
    message: "When is Milestone 2 due?",
    direction: "inbound",
    createdAt: "2026-07-24T14:20:00Z",
  },
  {
    id: "inter-6",
    channel: "telegram",
    message: "📌 Milestone 2 ('Implement IEEE Xplore & GitHub Research Clustering Engine') is due in 7 days on 2026-08-01. GitHub Issue #2 has been updated.",
    direction: "outbound",
    createdAt: "2026-07-24T14:20:03Z",
  },
];
