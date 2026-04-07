import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { viact } from "@viact/vite-plugin";
import { cloudflareAdapter } from "@viact/adapter-cloudflare";

export default defineConfig({
  plugins: [
    viact({
      adapter: cloudflareAdapter({
        vitePlugin: cloudflare(),
      }),
    }),
  ],
});
