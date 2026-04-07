import { CodeBlock } from "../../components/CodeBlock";

export function head() {
  return { title: "API Routes — viact docs" };
}

export function Component() {
  return (
    <div class="doc-page">
      <div class="breadcrumb">
        <a href="/">viact</a>
        <span class="breadcrumb-sep">/</span>
        <span>API Routes</span>
      </div>

      <h1 class="doc-title">API Routes</h1>
      <p class="doc-lead">
        Standalone server endpoints that live alongside your pages. Export named
        HTTP method handlers and return <code>Response</code> objects directly.
      </p>

      <h2>File Convention</h2>
      <p>
        API routes live in <code>src/api/</code>. The file path maps to the URL:
      </p>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr><th>File</th><th>URL</th></tr>
          </thead>
          <tbody>
            <tr><td><code>src/api/health.ts</code></td><td><code>/api/health</code></td></tr>
            <tr><td><code>src/api/users.ts</code></td><td><code>/api/users</code></td></tr>
            <tr><td><code>src/api/users/[id].ts</code></td><td><code>/api/users/:id</code></td></tr>
          </tbody>
        </table>
      </div>

      <div class="doc-sep" />

      <h2>Method Handlers</h2>
      <p>
        Export named functions for each HTTP method you want to handle. Unhandled
        methods return 405.
      </p>
      <CodeBlock
        filename="src/api/users.ts"
        code={`import type { LoaderArgs } from "viact";

export function GET({ request }: LoaderArgs) {
  return Response.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
}

export async function POST({ request }: LoaderArgs) {
  const body = await request.json();
  // Create user...
  return Response.json({ id: 3, ...body }, { status: 201 });
}`}
      />

      <div class="doc-sep" />

      <h2>API Middleware</h2>
      <p>
        API routes can have their own middleware chain, separate from page
        middleware. Configure it in <code>defineApp</code>:
      </p>
      <CodeBlock
        filename="src/routes.ts"
        code={`export const app = defineApp({
  // Page routes...
  api: {
    middleware: ["rateLimit"],
  },
});`}
      />
      <p>
        API middleware runs before the handler, just like page middleware runs
        before loaders.
      </p>

      <div class="doc-sep" />

      <h2>Full Control</h2>
      <p>
        API handlers receive the same <code>LoaderArgs</code> context (request,
        params, context, signal) and return standard <code>Response</code>{" "}
        objects. You have full control over status codes, headers, and body
        format.
      </p>
      <CodeBlock
        code={`export function GET() {
  return new Response("plain text", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}`}
      />

      <div class="doc-nav">
        <a href="/docs/data-loading" class="doc-nav-card prev">
          <div class="doc-nav-dir">Previous</div>
          <div class="doc-nav-title">← Data Loading</div>
        </a>
        <a href="/docs/middleware" class="doc-nav-card next">
          <div class="doc-nav-dir">Next</div>
          <div class="doc-nav-title">Middleware →</div>
        </a>
      </div>
    </div>
  );
}
