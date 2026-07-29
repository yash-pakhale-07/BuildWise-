import { ProjectPlan } from "@buildwise/shared";

export const mockPlansByIdea: Record<string, ProjectPlan> = {
  "idea-food-waste-2026": {
    id: "plan-food-waste-2026",
    ideaId: "idea-food-waste-2026",
    architecture: {
      frontend: "Next.js 14 Dashboard for hostel mess managers with real-time food waste analytics",
      backend: "Fastify API Gateway with BullMQ queues processing Smart Bin load cell telemetry & LSTM attendance forecasts",
      database: "PostgreSQL 16 relational store for daily mess logs & Redis 7 for live telemetry stream buffering",
      aiServices: ["IEEE Citation Grounder", "YOLOv8 Plate Waste Segmenter", "LSTM Attendance Predictor"],
      dataFlow: "Student RFID Swipe -> Attendance Prediction Engine -> Kitchen Batch Prep Advisory -> Smart Bin Load-Cell Feedback -> Closed-Loop AI Adjuster",
      diagramNodes: [
        { id: "node1", label: "Student Mess Check-in", type: "Input Sensor" },
        { id: "node2", label: "LSTM Attendance Predictor", type: "AI Service" },
        { id: "node3", label: "Fastify Gateway & BullMQ", type: "Backend API" },
        { id: "node4", label: "Smart Bin Load-Cell Node", type: "Hardware IoT" },
        { id: "node5", label: "GitHub App Scaffolder (PR & Issues)", type: "GitHub Bot" },
      ],
    },
    techStack: [
      { layer: "Frontend UI", choice: "Next.js 14 + Tailwind CSS + Recharts", why: "Real-time kitchen prep analytics & waste reduction charts." },
      { layer: "API & Gateway", choice: "Fastify (TypeScript) + Zod", why: "Microsecond telemetry routing from ESP32-CAM bin microcontrollers." },
      { layer: "Predictive ML", choice: "PyTorch + LSTM + YOLOv8", why: "Attendance forecasting & automated food item waste categorization." },
      { layer: "Persistence", choice: "PostgreSQL 16", why: "Relational schema storing daily meal logs, attendance, and bin load weights." },
    ],
    milestones: [
      { id: "m-fw-1", title: "Scaffold Core API Monorepo & Postgres Schema", dueInDays: 3, dueDate: "2026-07-28", status: "done", githubIssueUrl: "https://github.com/buildwise-org/student-research-food-waste/issues/1" },
      { id: "m-fw-2", title: "Train LSTM Hostel Mess Attendance Forecasting Model", dueInDays: 7, dueDate: "2026-08-01", status: "in_progress", githubIssueUrl: "https://github.com/buildwise-org/student-research-food-waste/issues/2" },
      { id: "m-fw-3", title: "Deploy ESP32-CAM Smart Bin Load Cell Telemetry Firmware", dueInDays: 14, dueDate: "2026-08-08", status: "pending", githubIssueUrl: "https://github.com/buildwise-org/student-research-food-waste/issues/3" },
      { id: "m-fw-4", title: "Integrate Automated GitHub App Repo & PR Scaffolder", dueInDays: 21, dueDate: "2026-08-15", status: "pending", githubIssueUrl: "https://github.com/buildwise-org/student-research-food-waste/issues/4" },
    ],
    datasets: [
      { name: "IEEE Open Dataset - Smart Bin Food Waste Logs", url: "https://ieeexplore.ieee.org/browse/sample-datasets", description: "Standardized cafeteria load-cell & image benchmarks." },
      { name: "University Hostel Mess Attendance Records 2024-2025", url: "https://github.com/SmartBinAI/food-waste-predictor", description: "Anonymized student meal attendance logs." },
    ],
    repos: [
      { name: "SmartBinAI/food-waste-predictor", url: "https://github.com/SmartBinAI/food-waste-predictor", stars: 890, description: "PyTorch model for food item waste categorization." },
      { name: "ieee-sample/esp32-loadcell-telemetry", url: "https://github.com/ieee-sample/esp32-loadcell-telemetry", stars: 240, description: "C++ firmware for ESP32 load cell bin sensors." },
    ],
    generatedDoc: `# Research Specification: Hostel Food Waste Reduction AI

## Abstract
This project implements a closed-loop AI system combining LSTM attendance forecasting with ESP32-CAM smart bin load-cell telemetry to minimize food waste in college hostel messes.

## Cited References
- IEEE Internet of Things Journal (DOI: 10.1109/JIOT.2023.3298101)
- IEEE Transactions on Computational Social Systems (DOI: 10.1109/TCSS.2023.3241908)
`,
    __mocked: true,
  },
  "idea-sat-ai-2026": {
    id: "plan-sat-ai-2026",
    ideaId: "idea-sat-ai-2026",
    architecture: {
      frontend: "Next.js 14 App Router dashboard with live telemetry widgets",
      backend: "Fastify Node.js API with BullMQ job worker queues",
      database: "PostgreSQL 16 for state persistence & Redis 7",
      dataFlow: "User Idea -> Signal Analysis -> IEEE Deep Search -> Cluster Synthesis -> Plan & Architecture -> GitHub Repository & Starter PR Scaffolding",
      diagramNodes: [
        { id: "node1", label: "Student Research Intake", type: "Input" },
        { id: "node2", label: "iNSIGHTS Layer 2 Synthesis", type: "AI Engine" },
        { id: "node3", label: "IEEE Xplore Academic Index", type: "Academic API" },
        { id: "node4", label: "Fastify Gateway & BullMQ", type: "Backend Services" },
        { id: "node5", label: "GitHub App Scaffolder (PR & Issues)", type: "GitHub Bot" },
      ],
    },
    techStack: [
      { layer: "Frontend UI", choice: "Next.js 14 + Tailwind CSS", why: "Dashboard UI" },
      { layer: "API & Gateway", choice: "Fastify (TypeScript)", why: "Microsecond routing" },
    ],
    milestones: [
      { id: "m1", title: "Scaffold Core API Monorepo & Postgres Schema", dueInDays: 3, dueDate: "2026-07-28", status: "done" },
    ],
    datasets: [],
    repos: [],
    generatedDoc: "# Research Specification: Satellite AI Compression",
    __mocked: true,
  },
};
