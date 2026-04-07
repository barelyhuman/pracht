import { CodeBlock } from "../../components/CodeBlock";

export function head() {
  return { title: "CLI — viact docs" };
}

export function Component() {
  return (
    <div class="doc-page">
      <div class="breadcrumb">
        <a href="/">viact</a>
        <span class="breadcrumb-sep">/</span>
        <span>CLI</span>
      </div>

      <h1 class="doc-title">CLI</h1>
      <p class="doc-lead">
        The <code>@viact/cli</code> package provides three commands for
        development, building, and previewing your app.
      </p>

      <h2>viact dev</h2>
      <p>
        Starts the Vite dev server with SSR middleware, HMR, and instant
        feedback.
      </p>
      <CodeBlock
        code={`viact dev

# Custom port
PORT=4000 viact dev`}
      />
      <p>
        Routes are rendered server-side on each request. Changes to routes,
        shells, loaders, and components are reflected immediately via HMR.
      </p>

      <div class="doc-sep" />

      <h2>viact build</h2>
      <p>
        Runs a production build: client bundle, server bundle, and SSG/ISG
        prerendering.
      </p>
      <CodeBlock
        code={`viact build`}
      />
      <p>Output:</p>
      <ul>
        <li><code>dist/client/</code> — static assets with hashed filenames</li>
        <li><code>dist/server/server.js</code> — server entry module</li>
        <li>SSG routes are pre-rendered as static HTML in <code>dist/client/</code></li>
      </ul>

      <div class="doc-sep" />

      <h2>viact preview</h2>
      <p>
        Runs the production server entry locally. Useful for smoke-testing the
        build before deploying.
      </p>
      <CodeBlock
        code={`viact preview

# Custom port
PORT=4000 viact preview`}
      />

      <div class="doc-sep" />

      <h2>Installation</h2>
      <p>
        The CLI is included in scaffolded projects. For existing projects, add
        it as a dev dependency:
      </p>
      <CodeBlock
        code={`pnpm add -D @viact/cli`}
      />
      <p>
        Then add scripts to your <code>package.json</code>:
      </p>
      <CodeBlock
        filename="package.json"
        code={`{
  "scripts": {
    "dev": "viact dev",
    "build": "viact build",
    "preview": "viact preview"
  }
}`}
      />

      <div class="doc-nav">
        <a href="/docs/shells" class="doc-nav-card prev">
          <div class="doc-nav-dir">Previous</div>
          <div class="doc-nav-title">← Shells</div>
        </a>
        <a href="/docs/deployment" class="doc-nav-card next">
          <div class="doc-nav-dir">Next</div>
          <div class="doc-nav-title">Deployment →</div>
        </a>
      </div>
    </div>
  );
}
