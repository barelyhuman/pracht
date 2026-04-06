import { defineConfig } from "vite";
import { viact } from "@viact/vite-plugin";

export default defineConfig({
  plugins: [
    viact({
      adapter: process.env.VIACT_ADAPTER === "vercel" ? "vercel" : "cloudflare",
    }),
  ],
});
