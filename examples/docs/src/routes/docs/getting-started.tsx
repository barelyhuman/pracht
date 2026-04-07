import { CodeBlock } from "../../components/CodeBlock";

export function head() {
  return { title: "Getting Started — viact docs" };
}

export function Component() {
  return (
    <div class="doc-page">
      <div class="breadcrumb">
        <a href="/">viact</a>
        <span class="breadcrumb-sep">/</span>
        <span>Getting Started</span>
      </div>

      <h1 class="doc-title">Getting Started</h1>
      <p class="doc-lead">
        Get a viact app running in under a minute. This guide covers project
        creation, development, and your first production build.
      </p>

      <h2>Create a Project</h2>
      <p>
        The fastest way to start is with <code>create-viact</code>. It
        scaffolds a working app with routing, a shell, an API route, and your
        choice of deployment adapter.
      </p>
      <CodeBlock
        code={`# pnpm
pnpm create viact my-app

# npm
npm create viact@latest my-app

# yarn
yarn create viact my-app

# bun
bunx create-viact my-app`}
      />
      <p>
        The CLI will ask you to choose an adapter (Node.js or Cloudflare
        Workers). You can change this later in your <code>vite.config.ts</code>.
      </p>

      <div class="doc-sep" />

      <h2>Project Structure</h2>
      <p>After scaffolding, your project looks like this:</p>
      <CodeBlock
        code={`my-app/
  src/
    routes.ts          # Route manifest (the central wiring file)
    routes/home.tsx    # First page component + loader
    shells/public.tsx  # Layout wrapper
    api/health.ts      # Sample API endpoint
  vite.config.ts       # Vite + viact plugin config
  package.json`}
      />

      <div class="doc-sep" />

      <h2>Development</h2>
      <p>
        Start the dev server with HMR. Changes to routes, shells, and loaders
        are reflected instantly.
      </p>
      <CodeBlock code={`pnpm dev`} />
      <p>
        Open <code>http://localhost:3000</code> to see your app. Edit{" "}
        <code>src/routes/home.tsx</code> and watch it update.
      </p>

      <div class="doc-sep" />

      <h2>Build &amp; Preview</h2>
      <CodeBlock
        code={`# Production build (client + server bundles, SSG prerendering)
pnpm build

# Preview the production build locally
pnpm preview`}
      />

      <div class="doc-sep" />

      <h2>Key Concepts</h2>
      <ul>
        <li>
          <strong>Route manifest</strong> — <code>src/routes.ts</code> declares
          all routes, their shells, middleware, and render modes. See{" "}
          <a href="/docs/routing">Routing</a>.
        </li>
        <li>
          <strong>Render modes</strong> — each route can be SSR, SSG, ISG, or
          SPA. See <a href="/docs/rendering">Rendering Modes</a>.
        </li>
        <li>
          <strong>Loaders &amp; actions</strong> — server-side data fetching and
          mutations. See <a href="/docs/data-loading">Data Loading</a>.
        </li>
        <li>
          <strong>Adapters</strong> — deploy to Node.js, Cloudflare, or Vercel.
          See <a href="/docs/adapters">Adapters</a>.
        </li>
      </ul>

      <div class="doc-nav">
        <div />
        <a href="/docs/routing" class="doc-nav-card next">
          <div class="doc-nav-dir">Next</div>
          <div class="doc-nav-title">Routing →</div>
        </a>
      </div>
    </div>
  );
}
