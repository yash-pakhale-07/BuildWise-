# BuildWise TODO & Assumptions Log

## Blocker / Credential Statuses
- BLOCKED: waiting on INSIGHTS_LAYER2_API_KEY credential — using mock client in `apps/api/src/mocks/insightsLayer2.mock.ts`
- BLOCKED: waiting on GITHUB_APP_ID / GITHUB_APP_PRIVATE_KEY credential — using mock client in `apps/api/src/mocks/githubApp.mock.ts`
- BLOCKED: waiting on IEEE_XPLORE_API_KEY credential — using mock client in `apps/api/src/mocks/ieeeXplore.mock.ts` (with arXiv search fallback design)
- BLOCKED: waiting on TELEGRAM_BOT_TOKEN credential — using mock webhook/interaction handler in backend

## Assumptions
- Monorepo structure uses `apps/web` (Next.js 14), `apps/api` (Fastify), and `packages/shared` (TypeScript types).
- Fastify server listens on port 4000; Next.js listens on port 3000.
- PostgreSQL database schema contains 7 core tables as defined in Section 2.5 of specification.
