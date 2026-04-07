import { CodeBlock } from "../../components/CodeBlock";

export function head() {
  return { title: "Deployment — viact docs" };
}

export function Component() {
  return (
    <div class="doc-page">
      <div class="breadcrumb">
        <a href="/">viact</a>
        <span class="breadcrumb-sep">/</span>
        <span>Deployment</span>
      </div>

      <h1 class="doc-title">Deployment</h1>
      <p class="doc-lead">
        viact apps deploy anywhere via platform adapters. Each adapter handles
        request conversion, asset serving, and ISG storage for its runtime.
      </p>

      <h2>Node.js</h2>
      <p>
        The default adapter. Generates a standalone Node.js server with static
        file serving and ISG support.
      </p>
      <CodeBlock
        filename="vite.config.ts"
        code={`import { viact } from "@viact/vite-plugin";

export default defineConfig({
  plugins: [preact(), viact()],
  // adapter defaults to "node"
});`}
      />
      <CodeBlock
        code={`# Build and run
viact build
node dist/server/server.js`}
      />

      <div class="doc-sep" />

      <h2>Cloudflare Workers</h2>
      <p>
        Deploys as a Cloudflare Worker with static assets served via the{" "}
        <code>ASSETS</code> binding.
      </p>
      <CodeBlock
        filename="vite.config.ts"
        code={`export default defineConfig({
  plugins: [preact(), viact({ adapter: "cloudflare" })],
});`}
      />
      <CodeBlock
        code={`# Build and deploy
viact build
wrangler deploy`}
      />
      <p>
        Configure bindings (KV, D1, R2) in <code>wrangler.jsonc</code>. They
        are available via <code>context.env</code> in loaders and actions.
      </p>

      <div class="doc-sep" />

      <h2>Vercel</h2>
      <p>
        Deploys as a Vercel Edge Function with static assets served from the
        CDN.
      </p>
      <CodeBlock
        filename="vite.config.ts"
        code={`export default defineConfig({
  plugins: [preact(), viact({ adapter: "vercel" })],
});`}
      />
      <CodeBlock
        code={`# Build and deploy
viact build
vercel deploy --prebuilt`}
      />

      <div class="doc-sep" />

      <h2>Custom Context</h2>
      <p>
        All adapters support a <code>createContext</code> option that enriches
        the context passed to loaders, actions, and middleware:
      </p>
      <CodeBlock
        code={`createNodeRequestHandler({
  app: resolvedApp,
  createContext: async ({ request }) => {
    const session = await getSession(request);
    return { session };
  },
});

// In a loader:
export async function loader({ context }: LoaderArgs) {
  const user = context.session?.user;
}`}
      />

      <div class="doc-nav">
        <a href="/docs/cli" class="doc-nav-card prev">
          <div class="doc-nav-dir">Previous</div>
          <div class="doc-nav-title">← CLI</div>
        </a>
        <a href="/docs/adapters" class="doc-nav-card next">
          <div class="doc-nav-dir">Next</div>
          <div class="doc-nav-title">Adapters Reference →</div>
        </a>
      </div>
    </div>
  );
}
