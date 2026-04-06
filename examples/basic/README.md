# Basic Example

This example uses the Node adapter by default. Set `VIACT_ADAPTER=vercel`
before building to emit Vercel's `.vercel/output/` directory instead.

## Commands

- `pnpm viact dev` starts the app with the regular Viact/Vite development server.
- `pnpm viact build` creates:
  - `dist/client/` for static assets and prerendered HTML
  - `dist/server/server.js` as the server bundle
- `pnpm viact preview` previews the production build locally.
