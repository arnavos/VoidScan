# VoidScan

A full-stack mini Security Operations Centre (SOC) with 5 modules: Reconnaissance, Threat Intelligence, File Analysis, Password Security, and Network Analysis.

## Local development

- `pnpm install`
- `pnpm --filter @workspace/api-server run dev` to start the API on `http://127.0.0.1:8080`
- `pnpm --filter @workspace/voidscan run dev` to start the frontend on `http://127.0.0.1:5173`
- `pnpm run typecheck` for a full workspace typecheck
- `pnpm run build` to typecheck and build all packages

The frontend proxies `/api` requests to the local API server during development.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React, Vite, Tailwind CSS, shadcn/ui, wouter
- API: Express 5
- Validation: Zod
- API codegen: Orval from the OpenAPI spec

## Project layout

- `artifacts/voidscan/src/` frontend app
- `artifacts/api-server/src/` API server
- `lib/api-spec/openapi.yaml` API contract
- `lib/api-client-react/src/generated/` generated React Query hooks
- `lib/api-zod/src/generated/` generated Zod schemas
