import { SearchResult, Cluster, ProjectPlan, TrendSignal } from "@buildwise/shared";
import { InsightsLayer2Client } from "../clients/insightsLayer2";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockInsightsLayer2Client implements InsightsLayer2Client {
  async getRealTimeSignal(topic: string): Promise<TrendSignal> {
    await sleep(900);
    // Determine dynamic score based on text length & keyword complexity
    const isAiTopic = /ai|agent|satellite|quantum|llm|copilot|neural|vision/i.test(topic);
    return {
      demandScore: isAiTopic ? 94 : 78,
      noveltyScore: isAiTopic ? 88 : 65,
      notes: `High student research activity detected in "${topic.slice(0, 40)}...". 34% growth in related IEEE paper submissions over the last 12 months. Key research gaps identified in lightweight deployment & real-time telemetry.`,
      __mocked: true,
    };
  }

  async deepSearch(query: string, sources: string[] = ["web", "github", "ieee_xplore"]): Promise<SearchResult[]> {
    await sleep(1200);
    return [
      {
        title: "IEEE: Real-Time Edge Processing & Deep Compression for Satellite Data Streams",
        url: "https://ieeexplore.ieee.org/document/9845120",
        snippet: "Presents an onboard FPGA-accelerated neural image codec achieving 18:1 compression ratio with sub-50ms latency on low-earth orbit nanosatellites.",
        sourceType: "ieee_xplore",
        meta: {
          doi: "10.1109/TGRS.2022.3190821",
          venue: "IEEE Transactions on Geoscience and Remote Sensing",
          year: 2022,
          authors: ["Dr. Aris Thorne", "Elena Vance", "Marcus Brody"],
        },
        __mocked: true,
      },
      {
        title: "IEEE: Distributed Agent Swarms for Heterogeneous Sensor Integration",
        url: "https://ieeexplore.ieee.org/document/10123984",
        snippet: "A decentralized consensus algorithm designed for low-power edge compute nodes operating under dynamic network partitions.",
        sourceType: "ieee_xplore",
        meta: {
          doi: "10.1109/IOTJ.2023.3267119",
          venue: "IEEE Internet of Things Journal",
          year: 2023,
          authors: ["K. Takahashi", "S. Patel", "J. R. Miller"],
        },
        __mocked: true,
      },
      {
        title: "GitHub: OpenSatelliteML / edge-vision-pipeline",
        url: "https://github.com/OpenSatelliteML/edge-vision-pipeline",
        snippet: "PyTorch & TensorRT pipeline for automated cloud coverage detection and onboard thumbnail extraction on CubeSats.",
        sourceType: "github",
        meta: { stars: 1420 },
        __mocked: true,
      },
      {
        title: "Web: NASA Jet Propulsion Lab Tech Briefs - Autonomous Nanosat Navigation",
        url: "https://www.jpl.nasa.gov/tech-briefs/autonomous-navigation-2024",
        snippet: "Overview of software requirements and latency budgets for next-gen Autonomous Navigation payloads on CubeSat platforms.",
        sourceType: "web",
        __mocked: true,
      },
    ];
  }

  async clusterKnowledge(results: SearchResult[]): Promise<Cluster[]> {
    await sleep(1100);
    return [
      {
        type: "existing_solutions",
        summary: "Current commercial payloads utilize legacy fixed-bitrate H.265 compression hardware, which incurs high processing overhead and cannot dynamically adjust to ground station bandwidth variations.",
        sources: results.filter((r) => r.sourceType === "web" || r.sourceType === "github"),
        __mocked: true,
      },
      {
        type: "academic",
        summary: "State-of-the-art IEEE literature highlights sub-vector quantization neural networks and adaptive transformer models optimized for low-power FPGA edge microcontrollers.",
        sources: results.filter((r) => r.sourceType === "ieee_xplore" || r.sourceType === "arxiv"),
        __mocked: true,
      },
      {
        type: "oss",
        summary: "Open-source projects like OpenSatelliteML provide solid PyTorch reference pipelines, but lack standardized Fastify/gRPC microservice wrappers for live telemetry streaming.",
        sources: results.filter((r) => r.sourceType === "github"),
        __mocked: true,
      },
      {
        type: "gaps",
        summary: "Key Research Gap: Absence of an open-source, automated hardware-in-the-loop (HIL) benchmark framework for student researchers to test dynamic AI model switching under simulated orbit conditions.",
        sources: results.slice(0, 2),
        __mocked: true,
      },
    ];
  }

  async generateProjectPlan(idea: string, clusters: Cluster[]): Promise<ProjectPlan> {
    await sleep(1400);
    return {
      architecture: {
        frontend: "Next.js 14 App Router dashboard with live telemetry widgets & milestone tracking",
        backend: "Fastify Node.js API with BullMQ job worker queues & WebSockets for real-time stream status",
        database: "PostgreSQL for state persistence & Redis for ephemeral queue state",
        aiServices: ["IEEE Xplore Citation Parser", "Insights Layer 2 Synthesis Engine", "GitHub App Automation Bot"],
        dataFlow: "User Idea -> Signal Analysis -> IEEE Deep Search -> Cluster Synthesis -> Plan & Architecture -> GitHub Repository & Starter PR Scaffolding",
        diagramNodes: [
          { id: "node1", label: "Student Research Request", type: "input" },
          { id: "node2", label: "Insights Layer 2 Synthesis", type: "ai" },
          { id: "node3", label: "IEEE Xplore Academic Index", type: "external" },
          { id: "node4", label: "Fastify API & BullMQ Job Queue", type: "backend" },
          { id: "node5", label: "GitHub App Scaffolder (PR & Issues)", type: "github" },
        ],
      },
      techStack: [
        { layer: "Frontend UI", choice: "Next.js 14 + Tailwind CSS + Lucide Icons", why: "Rapid interactive student dashboard development with server components." },
        { layer: "API & Gateway", choice: "Fastify (TypeScript) + CORS + Zod", why: "High throughput microsecond routing with strict schema validation." },
        { layer: "Async Jobs", choice: "BullMQ + Redis 7", why: "Reliable background processing for heavy research clustering & GitHub API sync." },
        { layer: "Persistence", choice: "PostgreSQL 16", why: "Relational schema storing users, ideas, research clusters, and milestone telemetry." },
        { layer: "AI / Search", choice: "iNSIGHTS Layer 2 SDK + IEEE Xplore API", why: "Deep multi-source academic aggregation & verified citation grounding." },
      ],
      milestones: [
        { title: "Scaffold Core API Monorepo & Postgres Schema", dueInDays: 3, status: "done" },
        { title: "Implement IEEE Xplore & GitHub Research Clustering Engine", dueInDays: 7, status: "in_progress" },
        { title: "Deploy Interactive Next.js Student Research Dashboard", dueInDays: 14, status: "pending" },
        { title: "Integrate Automated GitHub App Repo & PR Scaffolder", dueInDays: 21, status: "pending" },
        { title: "Launch Telegram Bot Daily Milestone Reminder Agent", dueInDays: 28, status: "pending" },
      ],
      datasets: [
        { name: "IEEE Xplore Open Dataset - Geospatial Edge ML", url: "https://ieeexplore.ieee.org/browse/sample-datasets", description: "Standardized benchmark images for low-bitrate satellite transmission." },
        { name: "NASA Sentinel-2 Cloud Coverage Testbed", url: "https://registry.opendata.aws/sentinel-2/", description: "AWS Open Data Sentinel-2 multispectral imagery." },
      ],
      repos: [
        { name: "OpenSatelliteML/edge-vision-pipeline", url: "https://github.com/OpenSatelliteML/edge-vision-pipeline", stars: 1420, description: "PyTorch & TensorRT edge pipeline." },
        { name: "ieee-sample/cube-sat-telemetry", url: "https://github.com/ieee-sample/cube-sat-telemetry", stars: 380, description: "C++ microcontroller firmware for CubeSat telemetry." },
      ],
      generatedDoc: `# Research Specification: ${idea}

## Abstract
This project addresses the critical challenge of bandwidth-constrained satellite data transmission by implementing an AI-driven compression and adaptive multi-tier edge pipeline grounded in IEEE Xplore literature.

## Key Research Objectives
1. Implement lightweight neural codec achieving >15:1 compression ratio.
2. Build Fastify API gateway for ground-station telemetry simulation.
3. Automatically generate GitHub milestone issues tied to open research questions.

## Cited References
- IEEE Transactions on Geoscience and Remote Sensing (DOI: 10.1109/TGRS.2022.3190821)
- IEEE Internet of Things Journal (DOI: 10.1109/IOTJ.2023.3267119)
`,
      __mocked: true,
    };
  }

  async translate(content: object, targetLang: string): Promise<object> {
    await sleep(400);
    return { ...content, __translatedTo: targetLang, __mocked: true };
  }
}

export const mockInsightsLayer2Client = new MockInsightsLayer2Client();
