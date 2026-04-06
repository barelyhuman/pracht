# Framework DX And Completeness Audit

Date: 2026-04-06

## Verdict

The framework is real and already credible for the core routing/rendering/data flow plus Cloudflare and Vercel output paths.

The main remaining gap is not whether there is a framework here. It is whether every documented surface is fully shipped, trustworthy, and usable end-to-end by a new user.

Current assessment:

1. DX: `7/10`
2. Feature completeness: `6/10`

## What I Validated

Commands run:

1. `pnpm test` -> passed
2. `pnpm build` -> passed
3. `pnpm e2e` -> passed
4. `pnpm build` in `examples/docs` -> passed

Repo surfaces checked:

1. `VISION_MVP.md`
2. `docs/ARCHITECTURE.md`
3. `docs/WORKSPACE.md`
4. `docs/ROUTING.md`
5. `docs/DATA_LOADING.md`
6. `docs/RENDERING_MODES.md`
7. `docs/ADAPTERS.md`
8. `packages/framework`
9. `packages/vite-plugin`
10. `packages/adapter-node`
11. `packages/adapter-cloudflare`
12. `packages/adapter-vercel`
13. `packages/cli`
14. `packages/start`
15. `examples/basic`
16. `examples/cloudflare`
17. `examples/docs`

## Main Findings

### 1. High: The Node deployment story is not fully integrated end-to-end

Files:

1. `packages/vite-plugin/src/index.ts:171-216`
2. `packages/adapter-node/src/index.ts:144-157`
3. `packages/cli/bin/viact.js:166-329`
4. `examples/docs/src/routes/docs/adapters.tsx:122-138`

Why this matters:

1. The Vite plugin generates server-entry code for `cloudflare` and `vercel`, but not for `node`.
2. `createNodeServerEntryModule()` exists, but it is not wired into the plugin path.
3. The CLI `preview` path acts as the practical Node server today, which means the adapter package is not clearly the real production path.
4. The docs present `node dist/server/server.js` as a straightforward deploy command, but the actual integration is less complete than that suggests.

### 2. High: `ErrorBoundary` is documented and typed, but not implemented in the runtime

Files:

1. `packages/framework/src/types.ts:170-203`
2. `packages/framework/src/runtime.ts:403-421`
3. `packages/framework/src/runtime.ts:441-469`
4. `docs/ARCHITECTURE.md:113-116`
5. `docs/DATA_LOADING.md:65-66`

Why this matters:

1. The public type surface includes `ErrorBoundary`.
2. The docs say route errors can be caught and rendered through an error boundary.
3. The runtime does not currently use `routeModule.ErrorBoundary` during loader or render failures.
4. That makes this a real contract gap, not just a missing nice-to-have.

### 3. Medium: The repo claims built-in Claude Code skills that are not present here

Files:

1. `docs/WORKSPACE.md:87-93`

Why this matters:

1. The docs say there are slash commands in `.claude/commands/`.
2. No `.claude/commands/*` or `.agents/*` files are present in this repo.
3. That weakens trust in the framework's "AI-assisted" story as a shipped repo feature.

### 4. Medium: Unit test discovery is noisy and inflates confidence

Files:

1. `vitest.config.ts:3-6`
2. `packages/framework/test/router.test.ts`
3. `packages/framework/test/runtime.test.ts`
4. `packages/start/test/index.test.js`

Why this matters:

1. `pnpm test` passed, but it picked up many duplicated tests through workspace-linked `node_modules`.
2. There are only a few real source test files, yet the run reports many more test files than expected.
3. This makes contributor feedback noisier and can overstate the real coverage signal.

### 5. Medium: Onboarding docs are still thin for the current framework surface area

Files:

1. `examples/docs/src/routes.ts:1-29`
2. `packages/start/README.md:1-32`

Why this matters:

1. There is no root `README` or quickstart path.
2. The docs app currently exposes routing, rendering, data loading, and adapters, but not a fuller install/start/testing/starter workflow.
3. For a framework, that leaves a lot of new-user path discovery to source reading.

### 6. Medium: A promised MVP runtime feature, `prefetch`, is still missing

Files:

1. `VISION_MVP.md:115`

Why this matters:

1. The vision doc lists client-side `prefetch` in the MVP runtime exports.
2. There is no `prefetch` implementation in the current packages.
3. This is another place where documented scope is ahead of shipped behavior.

## What Already Works Well

1. The core route manifest model is coherent and implemented.
2. SSR, SSG, ISG, SPA, loaders, actions, middleware, and API routes all exist as real framework behavior.
3. Cloudflare and Vercel build-output paths are implemented and covered by E2E tests.
4. `create-viact` exists as a real starter CLI, not just a planned package.
5. The docs example is a real consumer app and builds successfully.

## Recommended Fix Order

1. Either complete the Node adapter production path or narrow the docs so `preview` is clearly the supported Node path.
2. Implement `ErrorBoundary` handling or remove the current claim from docs and public types until it exists.
3. Tighten `vitest` discovery so linked `node_modules` do not duplicate framework tests.
4. Add a root quickstart and expand docs for install, starter usage, API routes, actions/forms, and testing.
5. Either ship the repo-local Claude commands or stop claiming them in repo docs.
6. Remove or defer the `prefetch` claim until it is implemented.

## Bottom Line

Viact has moved past the "interesting scaffold" stage. There is enough here to call it a functioning framework.

The remaining work is mostly about contract integrity: making sure docs, types, examples, and actual runtime behavior all say the same thing.
