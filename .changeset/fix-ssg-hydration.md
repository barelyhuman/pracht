---
"@pracht/cli": patch
"@pracht/vite-plugin": patch
---

Fix SSG prerendered pages missing client JS script tag and framework context

Two issues caused prerendered (SSG) pages to ship without working hydration:

1. **Vite 8 environment nesting**: The `@cloudflare/vite-plugin` outputs client assets
   to `<outDir>/client/`, so `outDir: "dist/client"` produced `dist/client/client/`.
   The CLI then couldn't find the Vite manifest, resulting in no `<script>` tag in
   prerendered HTML. Fixed by setting `outDir: "dist"`.

2. **Dual Preact context copies**: The CLI imported `prerenderApp` from its own
   `@pracht/core`, while the server bundle had its own bundled copy. Different
   `createContext` instances meant `useLocation()` returned `/` during prerendering,
   breaking shell features like active link highlighting. Fixed by re-exporting
   `prerenderApp` from the server module so the CLI uses the same bundled copy.
