# BuildWise

> **Transform raw project ideas into complete, research-backed development plans.**

BuildWise is a modern AI-powered Research & Innovation Platform that helps students, researchers, developers, startup founders, hackathon teams, and innovators validate, plan, and execute their ideas — backed by real IEEE academic literature, intelligent clustering, and automated GitHub scaffolding.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)
[![Fastify](https://img.shields.io/badge/Fastify-4-orange.svg)](https://fastify.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)

---

## Overview

BuildWise solves a universal problem: **most ideas die in the gap between inspiration and execution**.

Whether you are a student preparing a final-year project, a researcher writing a literature review, a developer building a startup MVP, or a hackathon team under a 48-hour deadline — BuildWise helps you:

- Validate your idea against thousands of IEEE papers and academic benchmarks
- Discover related prior art, research gaps, and novelty signals
- Cluster academic literature into actionable knowledge groups
- Generate full-stack architecture specifications and tech stack recommendations
- Plan milestone-based development roadmaps
- Scaffold GitHub repositories, PRs, and milestone issues automatically
- Ask an AI research assistant questions about your active project

---

## Who It Is For

| User Type | How BuildWise Helps |
|---|---|
| Students | Validate project novelty, find IEEE references, generate architecture |
| Researchers | Literature clustering, gap detection, signal tracking |
| Developers | Instant tech stack recommendations and architecture blueprints |
| Startup Founders | Market demand scores, feasibility analysis, GitHub scaffolding |
| Hackathon Teams | Rapid idea-to-plan pipeline in minutes |
| Innovators | Novelty validation and trend signal detection |

---

## Features

### Research and Validation

| Feature | Status | Description |
|---|---|---|
| Deep AI Research | Available | Multi-source academic research aggregation across IEEE Xplore, arXiv, GitHub |
| Literature Analysis | Available | Automated analysis of academic papers with DOI extraction |
| Research Clustering | Available | Auto-classifies sources into existing solutions, academic benchmarks, OSS, and gaps |
| Research Signal Detection | Available | Tracks IEEE submission velocity, publication growth, and market demand |
| Novelty Validation | Available | Scores your idea against existing research (0-100 novelty gauge) |

### Planning and Architecture

| Feature | Status | Description |
|---|---|---|
| Architecture Generation | Available | Full-stack system architecture with data flow narrative |
| Development Roadmap | Available | Milestone-based execution roadmap with due dates |
| Tech Stack Advisor | Available | Recommends and justifies every technology choice |

### Automation and AI

| Feature | Status | Description |
|---|---|---|
| GitHub PR and Issue Generation | Available (Mock) | Auto-scaffolds repos, starter PRs, and milestone issues |
| AI Agent Assistance | Available (Mock) | Research Q&A copilot via Telegram and in-app chat |

> **Note:** Features marked Mock currently use simulated service clients. Real API credentials (GitHub App, Telegram Bot, IEEE Xplore) are pending and can be activated by adding the appropriate .env values.

### Platform

| Feature | Status | Description |
|---|---|---|
| Workspace Management | Available | Manage multiple research ideas simultaneously |
| Multi-language Support | Available | English, Hindi, Marathi |
| Dark Mode | Available | Full dark/light theme toggle |
| Export Documentation | Upcoming | PDF export of generated research specs |

---

## Tech Stack

### Frontend (apps/web)
- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Lucide React icons
- next-themes for dark mode

### Backend (apps/api)
- Fastify high-performance HTTP framework
- TypeScript
- Node.js 20+
- Zod for runtime schema validation
- BullMQ for background job queues
- Octokit for GitHub API
- dotenv for config management

### Shared (packages/shared)
- TypeScript type definitions shared across frontend and backend
- Core domain models: Idea, ProjectPlan, Cluster, SearchResult, TrendSignal, AgentInteraction

### Database
- Current: In-memory database (zero-config for development)
- Planned: MongoDB Atlas or PostgreSQL 16 for persistent storage
- Cache: Redis 7 for BullMQ job queues and telemetry buffering

### AI and Integrations
- IEEE Xplore API for academic paper search and DOI retrieval (mock active)
- iNSIGHTS Layer 2 AI research synthesis engine (mock active)
- GitHub App for automated repo scaffolding, PR and issue creation (mock active)
- Telegram Bot for AI research copilot (mock active)

---

## Project Structure

```
buildwise-monorepo/
apps/
  api/                    Fastify backend (port 4000)
    src/
      agents/             AI agents (validation, research, plan, github, telegram)
      clients/            External service clients (IEEE, GitHub, iNSIGHTS)
      db/                 Database layer (in-memory + PostgreSQL)
      mocks/              Mock service clients for development
      routes/             Fastify route definitions
      server.ts           Application entry point
  web/                    Next.js 14 frontend (port 3000)
    app/                  App Router pages
      agent/              AI Research Copilot chat
      clustering/         Literature clustering view
      dashboard/          Innovation dashboard
      deepsearch/         IEEE and multi-source deep search
      github/             GitHub scaffolding view
      plan/               Project plan and architecture
      signals/            Research trend signals
      workspace/          Research workspace manager
      settings/           API keys and preferences
    components/           Shared UI components
    lib/
      i18n/               Internationalization (EN, HI, MR)
      mocks/              Frontend mock data fixtures
    locales/              Translation files

packages/
  shared/                 Shared TypeScript types and domain models

docs/
  demo-idea.md            Offline demo fixture and sample API responses

docker-compose.yml        PostgreSQL + Redis for local development
.env.example              Environment variable template
package.json              Monorepo workspace configuration
```

---

## Installation

### Prerequisites
- Node.js 20+
- npm 9+ with workspaces support
- Docker (optional, for PostgreSQL + Redis)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/buildwise.git
cd buildwise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Shared Package

```bash
npm run build:shared
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

### 5. Start Services (Optional)

```bash
docker-compose up -d
```

If you skip this step, the API automatically falls back to an in-memory database.

### 6. Run the Backend

```bash
npm run dev:api
```

API starts at http://localhost:4000

### 7. Run the Frontend

```bash
npm run dev:web
```

Web app starts at http://localhost:3000

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/idea | Submit and validate a new research idea |
| POST | /api/idea/:id/research | Trigger academic deep research |
| GET | /api/idea/:id/research/status | Poll research job status |
| POST | /api/idea/:id/plan | Generate full project plan and architecture |
| POST | /api/plan/:id/github-scaffold | Scaffold GitHub repo, PR and milestone issues |
| GET | /api/dashboard | Aggregate dashboard statistics |
| POST | /api/agent/webhook | Telegram bot webhook handler |

---

## Environment Variables

```env
# iNSIGHTS Layer 2 - AI Research Synthesis Engine
INSIGHTS_LAYER2_API_KEY=
INSIGHTS_LAYER2_BASE_URL=

# Database and Cache
DATABASE_URL=postgresql://user:pass@localhost:5432/buildwise
REDIS_URL=redis://localhost:6379

# GitHub App - for automated repo and PR scaffolding
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_APP_CLIENT_ID=
GITHUB_APP_CLIENT_SECRET=

# IEEE Xplore API - for academic paper search
IEEE_XPLORE_API_KEY=

# Telegram Bot - for AI research copilot
TELEGRAM_BOT_TOKEN=

# App and Server Settings
JWT_SECRET=your_secure_random_secret_here
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> All external API credentials are optional for local development. The system automatically uses mock service clients when credentials are absent.

---

## Roadmap

### Completed
- [x] Next.js 14 frontend with App Router
- [x] Fastify TypeScript backend
- [x] In-memory database with PostgreSQL-ready schema
- [x] Multi-source research pipeline (IEEE, GitHub, web)
- [x] Literature clustering engine
- [x] Research signal and novelty gauges
- [x] Full system architecture generator
- [x] Milestone-based development roadmap
- [x] GitHub App scaffolding skeleton
- [x] AI Agent framework (Telegram + in-app)
- [x] Multilingual support (English, Hindi, Marathi)
- [x] Dark mode
- [x] Workspace management
- [x] Mock services for all external integrations

### Upcoming
- [ ] MongoDB Atlas integration for persistent storage
- [ ] JWT-based user authentication and sessions
- [ ] Real IEEE Xplore API integration
- [ ] Real iNSIGHTS Layer 2 AI engine
- [ ] Real GitHub App installation and OAuth
- [ ] Real Telegram Bot deployment
- [ ] PDF export of generated research specs
- [ ] User accounts and project history
- [ ] Cloud deployment (Vercel + Railway)
- [ ] Collaborative workspaces
- [ ] Citation graph visualization

---

## Screenshots

> Screenshots will be added after the first production deployment.

### Idea Intake and Validation
Research hypothesis input with real-time novelty score gauge.

### Deep Research View
IEEE Xplore results with DOI, arXiv papers, and GitHub repositories.

### Literature Clustering
Auto-classified clusters: academic benchmarks, existing solutions, OSS, gaps.

### Project Plan and Architecture
System architecture diagram, tech stack table, and milestone roadmap.

### GitHub Scaffolding
Scaffolded repository link, starter pull request, and milestone GitHub issues.

### AI Research Copilot
Real-time chat interface grounded in your active IEEE project specification.

---

## Deployment

### Frontend to Vercel

```bash
npx vercel --prod
```

Set NEXT_PUBLIC_API_URL in Vercel environment settings to point to your deployed API.

### Backend to Railway or Render

```bash
npm run build:api
npm run start:api
```

Set all environment variables in your Railway or Render dashboard.

### Infrastructure Summary

| Component | Recommended Platform |
|---|---|
| Frontend | Vercel |
| Backend | Railway or Render |
| Database | MongoDB Atlas or PostgreSQL on Railway |
| Cache and Queue | Redis Cloud or Railway Redis |

---

## Contributing

We welcome contributions. Here is how to get started:

### Workflow

1. Fork the repository and clone your fork
2. Create a feature branch: git checkout -b feat/your-feature-name
3. Install dependencies: npm install
4. Build shared package: npm run build:shared
5. Make your changes
6. Commit using Conventional Commits: git commit -m "feat: add PDF export"
7. Push and open a Pull Request against main

### Commit Convention

```
feat:      New feature
fix:       Bug fix
docs:      Documentation changes
refactor:  Code refactoring
test:      Adding or updating tests
chore:     Maintenance tasks
```

### Code Standards

- All code must be TypeScript with strict types
- Use Zod for all runtime validation in the API
- Import shared types exclusively from @buildwise/shared
- Keep mock services in mocks/ directories, never mix with production code
- Follow existing file naming conventions

### Pull Request Checklist

- TypeScript compiles without errors
- No new @ideaforge references (use @buildwise)
- Mock vs real services are clearly separated
- Documentation updated if applicable
- PR description explains the change and motivation

---

## License

MIT License

Copyright (c) 2026 BuildWise

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Built with love by the BuildWise team.
