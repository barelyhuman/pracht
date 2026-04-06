export const VIACT_CLIENT_MODULE_ID = "virtual:viact/client";
export const VIACT_SERVER_MODULE_ID = "virtual:viact/server";

export interface ViactPluginOptions {
  appFile?: string;
  routesDir?: string;
  shellsDir?: string;
  middlewareDir?: string;
}

export interface ViactPluginDefinition {
  name: string;
  enforce: "pre";
  resolveId(id: string): string | null;
  load(id: string): string | null;
}

const DEFAULTS: Required<ViactPluginOptions> = {
  appFile: "/src/routes.ts",
  middlewareDir: "/src/middleware",
  routesDir: "/src/routes",
  shellsDir: "/src/shells",
};

export function viact(options: ViactPluginOptions = {}): ViactPluginDefinition {
  const resolved = resolveOptions(options);

  return {
    name: "viact",
    enforce: "pre",
    resolveId(id) {
      if (id === VIACT_CLIENT_MODULE_ID || id === VIACT_SERVER_MODULE_ID) {
        return id;
      }

      return null;
    },
    load(id) {
      if (id === VIACT_CLIENT_MODULE_ID) {
        return createViactClientModuleSource();
      }

      if (id === VIACT_SERVER_MODULE_ID) {
        return createViactServerModuleSource(resolved);
      }

      return null;
    },
  };
}

export function createViactClientModuleSource(): string {
  return [
    'import { startApp } from "viact";',
    "",
    "startApp();",
    "",
  ].join("\n");
}

export function createViactServerModuleSource(
  options: ViactPluginOptions = {},
): string {
  const resolved = resolveOptions(options);
  const registrySource = createViactRegistryModuleSource(resolved);

  return [
    'import { resolveApp } from "viact";',
    `import { app } from ${JSON.stringify(resolved.appFile)};`,
    "",
    registrySource,
    "",
    "export const resolvedApp = resolveApp(app);",
    "",
  ].join("\n");
}

export function createViactRegistryModuleSource(
  options: ViactPluginOptions = {},
): string {
  const resolved = resolveOptions(options);

  return [
    `export const routeModules = import.meta.glob(${JSON.stringify(`${resolved.routesDir}/**/*.{ts,tsx,js,jsx}`)});`,
    `export const shellModules = import.meta.glob(${JSON.stringify(`${resolved.shellsDir}/**/*.{ts,tsx,js,jsx}`)});`,
    `export const middlewareModules = import.meta.glob(${JSON.stringify(`${resolved.middlewareDir}/**/*.{ts,tsx,js,jsx}`)});`,
    "",
    "export const registry = {",
    "  routeModules,",
    "  shellModules,",
    "  middlewareModules,",
    "};",
  ].join("\n");
}

function resolveOptions(options: ViactPluginOptions): Required<ViactPluginOptions> {
  return {
    ...DEFAULTS,
    ...options,
  };
}
