import { CodeBlock } from "../../components/CodeBlock";

export function head() {
  return { title: "Performance — viact docs" };
}

export function Component() {
  return (
    <div class="doc-page">
      <div class="breadcrumb">
        <a href="/">viact</a>
        <span class="breadcrumb-sep">/</span>
        <span>Performance</span>
      </div>

      <h1 class="doc-title">Performance</h1>
      <p class="doc-lead">
        viact optimizes page load performance through automatic code splitting,
        module preloading, and vendor chunk extraction — with zero
        configuration.
      </p>

      <h2>Route-Level Code Splitting</h2>
      <p>
        Every route and shell module is loaded via{" "}
        <code>import.meta.glob()</code>, which Vite compiles into dynamic
        imports. Each route becomes its own JS chunk, loaded only when needed.
      </p>
      <p>
        On the server, viact knows which route and shell are being rendered.
        It uses this to emit <code>&lt;link rel="modulepreload"&gt;</code>{" "}
        hints in the HTML <code>&lt;head&gt;</code> so the browser can start
        downloading the matched route's JS chunks immediately — before the
        client entry script even executes.
      </p>
      <CodeBlock
        code={`<!-- Automatically injected for the matched route -->
<link rel="modulepreload" href="/assets/home-Bx7kZ3.js">
<link rel="modulepreload" href="/assets/vendor-D9fK2a.js">`}
      />

      <div class="doc-sep" />

      <h2>Vendor Chunk</h2>
      <p>
        Preact, preact/hooks, and preact-suspense are extracted into a shared{" "}
        <code>vendor</code> chunk. This means:
      </p>
      <ul>
        <li>
          The vendor chunk is cached once by the browser and shared across all
          routes.
        </li>
        <li>
          Route chunks stay small — they only contain route-specific code.
        </li>
        <li>
          Deploying a route change doesn't invalidate the vendor cache.
        </li>
      </ul>

      <div class="doc-sep" />

      <h2>CSS Per Page</h2>
      <p>
        viact builds a CSS manifest that maps each source file to its
        transitive CSS dependencies. At request time, only the CSS needed for
        the matched route and shell is injected as{" "}
        <code>&lt;link rel="stylesheet"&gt;</code> tags — no unused CSS is
        sent.
      </p>

      <div class="doc-sep" />

      <h2>Error Overlay in Dev</h2>
      <p>
        During development, if a loader, action, or component throws an error
        during server-side rendering, viact renders a framework-aware error
        overlay instead of a generic Vite error page.
      </p>
      <p>The overlay shows:</p>
      <ul>
        <li>The error message and name</li>
        <li>A source-mapped stack trace (with Vite's SSR stack fix applied)</li>
        <li>The route ID and file path that failed (when available)</li>
      </ul>
      <p>
        The overlay auto-reloads when you save a fix — it listens for Vite's
        HMR full-reload event and refreshes the page automatically.
      </p>
      <div class="callout callout-note">
        <span class="callout-icon">Note</span>
        <span>
          The error overlay only appears during <code>viact dev</code>.
          Production builds return standard error responses (or render your{" "}
          <code>ErrorBoundary</code> component if one is exported from the
          route module).
        </span>
      </div>

      <div class="doc-sep" />

      <h2>What You Get For Free</h2>
      <p>
        None of these optimizations require configuration. A standard viact
        app automatically gets:
      </p>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr>
              <th>Optimization</th>
              <th>What It Does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Route code splitting</td>
              <td>Each route is a separate JS chunk, loaded on demand</td>
            </tr>
            <tr>
              <td>Modulepreload hints</td>
              <td>Browser starts downloading route JS before client entry runs</td>
            </tr>
            <tr>
              <td>Vendor extraction</td>
              <td>Preact is cached once, shared across routes</td>
            </tr>
            <tr>
              <td>Per-page CSS</td>
              <td>Only CSS for the matched route/shell is included</td>
            </tr>
            <tr>
              <td>Intent prefetching</td>
              <td>Route data is fetched on hover/focus before click</td>
            </tr>
            <tr>
              <td>Dev error overlay</td>
              <td>Framework-aware errors with auto-reload on fix</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-nav">
        <a href="/docs/prefetching" class="doc-nav-card prev">
          <div class="doc-nav-dir">Previous</div>
          <div class="doc-nav-title">← Prefetching</div>
        </a>
        <div />
      </div>
    </div>
  );
}
