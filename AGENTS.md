# AGENTS.md

Monorepo with 3 SSR apps (TanStack Start + Cloudflare Workers). **SPA mode is forbidden** — all pages must render complete HTML on the server for SEO.

## Setup commands

- Install deps: `pnpm install`
- Start Context dev server: `pnpm dev:context` (port 3003)
- Start Permissive dev server: `pnpm dev:permissive` (port 3004)
- Start Roots dev server: `pnpm dev:roots` (port 3005)

## Dev environment tips

- Always use `pnpm dev:*` while iterating. Do **not** run `pnpm build` during development.
- Use `pnpm --filter <name> <command>` to target specific apps or packages.
- After adding dependencies, restart the dev server.
- Build output goes to `dist/` (Vite 8).

## Testing instructions

- Run `pnpm typecheck` for TypeScript type checking.
- Run `pnpm lint` for Biome linting. Use `pnpm lint:fix` to auto-fix.
- Run `pnpm test` for Vitest unit tests.
- Run `pnpm test:e2e` for Playwright E2E tests.
- Run `pnpm quality` to execute all checks at once.
- Fix any errors before committing.

## Code style

- TypeScript required (`.ts`/`.tsx`).
- Biome config: 2-space indent, single quotes, semicolons always.
- No `any` type — use `unknown` or proper typing.
- No empty `catch` blocks or unexplained `@ts-ignore`.
- Import layers: `L3 (apps, ui) → L2 (i18n, search, seo) → L1 (data, platform) → L0 (core, config)`.

## PR instructions

- Commit format: `<type>(<scope>): <description>` (e.g., `feat(context): add search`)
- Run `pnpm typecheck && pnpm lint && pnpm test` before committing.
- Verify SSR output contains HTML content, not empty `<div id="root"></div>`.

## Critical rules

- **No SPA mode** — SSR is mandatory for SEO.
- **No package downgrades** — fix issues with upgrades or code changes.
- **No Turborepo Remote Cache** — use local cache only (R2 cost optimization).
