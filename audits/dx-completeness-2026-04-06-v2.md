# DX And Completeness Audit (v2)

Date: 2026-04-06

## Verdict

Significant progress since the earlier audits. Most of the critical issues from the first audit have been addressed: SPA direct loads work, `<Form>` intercepts properly, action redirects/headers are implemented, API routes run through middleware, and real client-side navigation exists with history and link interception.

The framework has crossed from "impressive prototype" into "functional framework with real runtime behavior."

Current assessment:

1. Framework concept: `9/10`
2. Happy-path functionality: `8/10`
3. Edge-case/runtime correctness: `7/10`
4. Contributor DX: `7/10`
5. New-user DX: `5/10`

## What I Validated

Commands run:

1. `pnpm typecheck` -> **failed** (1 error in adapter-node)
2. `pnpm test` -> **failed** (2 failures: wrangler test leak + scaffold test)
3. `pnpm build` -> **passed**
4. `pnpm e2e` -> **passed** (23/23 tests)

## What Has Been Fixed Since Last Audit

These were Critical/High in the previous audits and are now resolved:

### SPA direct loads now work

`packages/framework/src/router.ts:138-151` — When `render: "spa"` routes are loaded directly, the client router detects `data == null` and fetches route state via `fetchViactRouteState()` before rendering. Falls back to full page load on error. E2E test at `e2e/basic.test.ts:118` confirms this.

### `<Form>` intercepts submissions properly

`packages/framework/src/runtime.ts:221-252` — `<Form>` now intercepts non-safe method submissions via `preventDefault`, delegates to `useSubmitAction()` with FormData, and stays in-app. E2E test at `e2e/basic.test.ts:80` confirms form submission keeps the route hydrated.

### Action redirects and headers work

`packages/framework/src/runtime.ts:587-613` — `actionResultToResponse()` converts `{ redirect }` envelopes into real HTTP 302 responses with `location` header. Custom `{ headers }` are preserved. `{ revalidate }` hints are serialized in the response.

### API routes run through middleware

`packages/framework/src/runtime.ts:286-342` — API route dispatch now runs `runMiddlewareChain()` using the app's `api.middleware` configuration before calling the API handler.

### CSRF protection is implemented

`packages/framework/src/runtime.ts:816-828` — `validateActionCsrfRequest()` checks Origin/Referer for same-origin before allowing unsafe methods.

### Client-side navigation is real

`packages/framework/src/router.ts:82-209` — Full client router with:
- `navigate()` function that fetches route state JSON and re-renders
- Document-level click interception for `<a>` elements (filters modified clicks, external origins, downloads)
- `popstate` listener for back/forward
- `useNavigate()` hook for programmatic navigation
- E2E tests: link navigation (line 159), shell boundary crossing (line 183), back button (line 211), same-shell navigation (line 236)

### Packages export dist, not raw src

All packages now build via tsdown and export `dist/index.mjs` + `dist/index.d.mts`.

### `.claude/commands/` exist

`/scaffold`, `/debug`, `/deploy` commands are present and populated. Previous audit's claim about missing commands is resolved.

### `create-viact` includes `@viact/cli`

`packages/start/src/index.js` adds `@viact/cli` to generated project devDependencies.

## Remaining Issues

### 1. High: `pnpm typecheck` fails

```
packages/adapter-node/src/index.ts(134,22): error TS2339: Property 'cssUrls' does not exist on type 'NodeAdapterOptions<TContext>'.
```

`NodeAdapterOptions` (line 22-32) does not include `cssUrls`, but line 134 passes `options.cssUrls` to `handleViactRequest()`. The type has `cssManifest` but not `cssUrls`.

This means the repo's main quality gate (`pnpm check`) is red. Same class of issue as the previous audit's Vercel type error — different file, same impact.

### 2. High: `pnpm test` has 2 failures

**Failure 1:** `examples/docs/node_modules/wrangler/templates/__tests__/pages-dev-util.test.ts` — Vitest discovers a test file inside `node_modules/wrangler`. The duplicate-test-discovery issue from previous audits persists, just in a different form. The `vitest.config.ts` exclude list should add `**/node_modules/**`.

**Failure 2:** `packages/start/test/index.test.js` — Scaffold test expects `src/worker.ts` in a Cloudflare scaffold, but the generator no longer produces that file. The test is stale relative to the scaffold implementation.

### 3. Medium: `ErrorBoundary` is typed but not implemented in the runtime

`packages/framework/src/types.ts:170-172` defines `ErrorBoundaryProps`. `types.ts:201` allows route modules to export `ErrorBoundary`. But `runtime.ts` never catches loader errors or render failures and never renders the ErrorBoundary component. The runtime has no `try/catch` around `routeModule.loader()` (line 411) or `renderToStringAsync()` (line 489).

This is a contract gap: users who export `ErrorBoundary` from a route module will find it never renders.

### 4. Medium: `examples/basic` does not have `@viact/cli` as a dependency

`examples/basic/package.json` has no `@viact/cli` in devDependencies. The example only works because the monorepo's root hoists the CLI. A cloned example in isolation would fail with `Command "viact" not found`.

This is the same finding as the previous audit. The scaffold (`create-viact`) correctly includes it; the hand-maintained example does not.

### 5. Medium: No `prefetch` implementation

`VISION_MVP.md` lists client-side `prefetch` as an MVP runtime export. No implementation exists anywhere in the codebase. This is a documented-but-unshipped feature.

### 6. Low: No root README

Still no `README.md` in the repo root. New users arriving at the repo have `VISION_MVP.md` and `CLAUDE.md` but no standard entry point explaining what viact is, how to install it, or how to get started.

### 7. Low: Node adapter production entry is minimal

`packages/adapter-node/src/index.ts:144-158` generates a bare `createServer` + `listen`. No graceful shutdown, no clustering, no error handling. This is fine for the current scope, but the docs should set expectations.

## E2E Coverage Assessment

The 23 E2E tests now cover a meaningful surface:

| Area | Covered | Tests |
|------|---------|-------|
| SSR rendering + loader data | Yes | Lines 7, 51 |
| Hydration state injection | Yes | Line 22 |
| Security headers | Yes | Line 31 |
| Head metadata | Yes | Line 39 |
| Middleware redirects (auth) | Yes | Line 63 |
| Authenticated routes | Yes | Line 71 |
| Form submission (in-app) | Yes | Line 80 |
| SPA shell + direct hydration | Yes | Lines 107, 118 |
| Route state JSON | Yes | Line 132 |
| Client-side navigation | Yes | Lines 159, 183, 211, 236 |
| API routes (GET, POST, 405, 404) | Yes | Lines 257-280 |
| Console error check | Yes | Line 289 |
| Cloudflare build output | Yes | Separate file |
| Vercel build output | Yes | Separate file |

**Gaps:** No E2E for action redirects, ErrorBoundary rendering, ISG revalidation behavior, or prefetch (not implemented).

## Comparison To Previous Audit Findings

| Previous Finding | Status |
|-----------------|--------|
| Critical: SPA direct loads broken | **Fixed** |
| Critical: `<Form>` navigates to raw JSON | **Fixed** |
| Critical: `create-viact` missing `@viact/cli` | **Fixed** |
| High: `pnpm typecheck` fails | **Still failing** (different error) |
| High: API routes skip middleware | **Fixed** |
| High: Example README commands broken | **Needs verification** (example still lacks `@viact/cli`) |
| Medium: Action redirects/headers not implemented | **Fixed** |
| Medium: Node adapter incomplete | **Improved** (ISG + entry module exist) |
| Medium: No `prefetch` | **Still missing** |
| Medium: Test discovery noise | **Still present** (different form) |
| Medium: No root README | **Still missing** |

## Recommended Fix Order

1. Add `cssUrls` to `NodeAdapterOptions` type to fix typecheck.
2. Exclude `**/node_modules/**` in vitest config and fix the stale scaffold test.
3. Add `@viact/cli` to `examples/basic/package.json` devDependencies.
4. Implement ErrorBoundary rendering in the runtime (catch loader/render errors, render the boundary component).
5. Add a root README with quickstart.
6. Either implement `prefetch` or remove it from VISION_MVP.

## Bottom Line

Viact has addressed the most damaging issues from the earlier audits. The three critical breakages (SPA loads, Form behavior, scaffold missing CLI) are all resolved. The runtime now delivers on its documented contracts for routing, data loading, actions, middleware, and client navigation.

What remains is polish: a red typecheck, noisy test discovery, a missing ErrorBoundary implementation, and onboarding gaps. These are real issues but they are the kind that come from a framework that is functional and growing, not one that is fundamentally broken.

The gap between "what the docs promise" and "what the runtime delivers" has narrowed significantly.
