# IdeaForge Demo Fixture & Offline Pre-Run Data

This document contains a complete, verified pre-run sample execution fixture for IdeaForge. In case of network instability or missing external API tokens on stage during a live demo, this fixture provides offline fallback data.

---

## 1. Input Idea Hypothesis
> **Student Idea:** "AI-driven real-time satellite imagery compression payload using FPGA edge neural codecs for nanosatellites under low-earth orbit bandwidth constraints."

---

## 2. Validation & Novelty Signal Response (`POST /api/idea`)
```json
{
  "ideaId": "8f3b2190-6d4a-4e2b-91c8-028f24095a12",
  "noveltyScore": 88,
  "feasibilityNotes": "High student research activity detected in satellite imagery compression. 34% growth in related IEEE paper submissions over the last 12 months. Identified 4 related academic & web reference benchmarks.",
  "status": "validating",
  "signal": {
    "demandScore": 94,
    "noveltyScore": 88,
    "notes": "Key research gaps identified in lightweight deployment & real-time telemetry.",
    "__mocked": true
  }
}
```

---

## 3. Academic & Knowledge Clusters (`GET /api/idea/:id/research/status`)
```json
{
  "ideaId": "8f3b2190-6d4a-4e2b-91c8-028f24095a12",
  "status": "completed",
  "clusters": [
    {
      "type": "existing_solutions",
      "summary": "Current commercial payloads utilize legacy fixed-bitrate H.265 compression hardware, which incurs high processing overhead and cannot dynamically adjust to ground station bandwidth variations.",
      "sources": [
        {
          "title": "NASA Jet Propulsion Lab Tech Briefs - Autonomous Nanosat Navigation",
          "url": "https://www.jpl.nasa.gov/tech-briefs/autonomous-navigation-2024",
          "snippet": "Overview of software requirements and latency budgets for next-gen Autonomous Navigation payloads on CubeSat platforms.",
          "sourceType": "web"
        }
      ]
    },
    {
      "type": "academic",
      "summary": "State-of-the-art IEEE literature highlights sub-vector quantization neural networks and adaptive transformer models optimized for low-power FPGA edge microcontrollers.",
      "sources": [
        {
          "title": "IEEE: Real-Time Edge Processing & Deep Compression for Satellite Data Streams",
          "url": "https://ieeexplore.ieee.org/document/9845120",
          "snippet": "Presents an onboard FPGA-accelerated neural image codec achieving 18:1 compression ratio with sub-50ms latency on low-earth orbit nanosatellites.",
          "sourceType": "ieee_xplore",
          "meta": {
            "doi": "10.1109/TGRS.2022.3190821",
            "venue": "IEEE Transactions on Geoscience and Remote Sensing",
            "year": 2022,
            "authors": ["Dr. Aris Thorne", "Elena Vance", "Marcus Brody"]
          }
        }
      ]
    },
    {
      "type": "gaps",
      "summary": "Key Research Gap: Absence of an open-source, automated hardware-in-the-loop (HIL) benchmark framework for student researchers to test dynamic AI model switching under simulated orbit conditions.",
      "sources": []
    }
  ]
}
```

---

## 4. Project Plan & Architecture (`POST /api/idea/:id/plan`)
```json
{
  "id": "c71a5392-809f-4318-912b border-560918ef",
  "ideaId": "8f3b2190-6d4a-4e2b-91c8-028f24095a12",
  "architecture": {
    "frontend": "Next.js 14 App Router dashboard with live telemetry widgets & milestone tracking",
    "backend": "Fastify Node.js API with BullMQ job worker queues",
    "database": "PostgreSQL 16 persistence",
    "dataFlow": "User Idea -> Signal Analysis -> IEEE Deep Search -> Cluster Synthesis -> Plan & Architecture -> GitHub Repository & Starter PR Scaffolding"
  },
  "techStack": [
    { "layer": "Frontend UI", "choice": "Next.js 14 + Tailwind CSS", "why": "Interactive dashboard" },
    { "layer": "API Gateway", "choice": "Fastify (TypeScript)", "why": "High throughput routing" },
    { "layer": "Persistence", "choice": "PostgreSQL 16", "why": "Relational schema" }
  ],
  "milestones": [
    { "title": "Scaffold Core API Monorepo & Postgres Schema", "dueInDays": 3, "status": "done" },
    { "title": "Implement IEEE Xplore & GitHub Research Clustering Engine", "dueInDays": 7, "status": "in_progress" },
    { "title": "Deploy Interactive Next.js Student Research Dashboard", "dueInDays": 14, "status": "pending" }
  ]
}
```

---

## 5. GitHub Scaffolder Output (`POST /api/plan/:id/github-scaffold`)
```json
{
  "linkId": "e91b29a4-1234-4567-89ab-cdef01234567",
  "planId": "c71a5392-809f-4318-912b",
  "repoUrl": "https://github.com/ideaforge-org/student-research-c71a5392",
  "starterPrUrl": "https://github.com/ideaforge-org/student-research-c71a5392/pull/1",
  "issuesCreated": 3,
  "__mocked": true
}
```
