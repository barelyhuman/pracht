# Cloudflare Example

This example is wired to Viact's Cloudflare build target.

## Commands

- `pnpm viact dev` starts the app with the regular Viact/Vite development server.
- `pnpm viact build` creates:
  - `dist/client/` for static assets and prerendered HTML
  - `dist/server/server.js` as the Worker bundle
- `pnpm viact preview` previews the production build locally.

## Deploy

The `wrangler.jsonc` in this directory is yours to edit — add KV, D1, R2,
cron triggers, or any other Cloudflare bindings as needed. After building:

```bash
pnpm dlx wrangler deploy
```
