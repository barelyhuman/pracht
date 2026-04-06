# E2E

Playwright coverage belongs here once the dev/build/preview loop is wired.

The first pass of the scaffold focuses on the shared package boundaries:

- `viact` for the manifest, routing, and runtime contracts
- `@viact/vite-plugin` for virtual module generation
- `@viact/adapter-node` for Node request/response bridging
- `@viact/cli` for the command surface
