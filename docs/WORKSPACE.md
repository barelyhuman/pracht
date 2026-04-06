# Workspace Shape

This repo now has the first pass of the Phase 1 monorepo layout described in
`VISION_MVP.md`.

## Packages

| Path | Package | Current role |
|------|---------|--------------|
| `packages/framework` | `viact` | Core manifest API, route resolution, route matching, runtime contracts |
| `packages/vite-plugin` | `@viact/vite-plugin` | Virtual module IDs and generated module source for client/server registries |
| `packages/adapter-node` | `@viact/adapter-node` | Node `IncomingMessage`/`ServerResponse` bridge into `handleViactRequest()` |
| `packages/cli` | `@viact/cli` | `viact dev`, `build`, and `preview` command surface |
| `examples/basic` | `@viact/example-basic` | Example app manifest, shells, middleware, and route modules |

## What Exists Today

- The `viact` package already defines the public MVP surface for `defineApp()`,
  `route()`, `group()`, `timeRevalidate()`, `resolveApp()`, and
  `matchAppRoute()`.
- Route groups now flatten into resolved routes with inherited shell,
  middleware, render mode, and path prefix metadata.
- Dynamic segment and catch-all matching are implemented so the router can be
  exercised independently of rendering.
- The Vite plugin package now defines the `virtual:viact/client` and
  `virtual:viact/server` module boundaries plus generated `import.meta.glob()`
  registries.
- The Node adapter translates Node requests into Web `Request` objects and hands
  them to the framework entry point.
- The CLI currently defines the user-facing command shape while the real dev,
  build, and preview workflows are still to be implemented.

## Next Layer

The next meaningful slice is to make the current package boundaries executable:

1. Execute loaders and shell rendering inside `handleViactRequest()`.
2. Hydrate the example app through the generated client and server virtual modules.
3. Replace the CLI placeholders with real Vite-backed `dev`, `build`, and `preview` commands.
4. Add Playwright coverage around the example app once the loop is runnable.
