import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  external: ["preact", "preact/hooks", "preact-render-to-string"],
});
