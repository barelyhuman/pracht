import type {
  GroupDefinition,
  GroupMeta,
  ResolvedRoute,
  ResolvedViactApp,
  RouteDefinition,
  RouteMatch,
  RouteMeta,
  RouteParams,
  RouteSegment,
  RouteTreeNode,
  TimeRevalidatePolicy,
  ViactApp,
  ViactAppConfig,
} from "./types.ts";

interface InheritedRouteConfig {
  pathPrefix: string;
  shell?: string;
  render?: ResolvedRoute["render"];
  middleware: string[];
}

export function timeRevalidate(seconds: number): TimeRevalidatePolicy {
  if (!Number.isInteger(seconds) || seconds <= 0) {
    throw new Error("timeRevalidate expects a positive integer number of seconds.");
  }

  return {
    kind: "time",
    seconds,
  };
}

export function route(
  path: string,
  file: string,
  meta: RouteMeta = {},
): RouteDefinition {
  return {
    kind: "route",
    path: normalizeRoutePath(path),
    file,
    ...meta,
  };
}

export function group(
  meta: GroupMeta,
  routes: RouteTreeNode[],
): GroupDefinition {
  return {
    kind: "group",
    meta,
    routes,
  };
}

export function defineApp(config: ViactAppConfig): ViactApp {
  return {
    shells: config.shells ?? {},
    middleware: config.middleware ?? {},
    routes: config.routes,
  };
}

export function resolveApp(app: ViactApp): ResolvedViactApp {
  const routes: ResolvedRoute[] = [];
  const inherited: InheritedRouteConfig = {
    pathPrefix: "/",
    middleware: [],
  };

  for (const node of app.routes) {
    flattenRouteNode(app, node, inherited, routes);
  }

  return {
    shells: app.shells,
    middleware: app.middleware,
    routes,
  };
}

export function matchAppRoute(
  app: ViactApp | ResolvedViactApp,
  pathname: string,
): RouteMatch | undefined {
  const resolved = isResolvedApp(app) ? app : resolveApp(app);
  const normalizedPathname = normalizeRoutePath(pathname);
  const targetSegments = splitPathSegments(normalizedPathname);

  for (const currentRoute of resolved.routes) {
    const params = matchRouteSegments(currentRoute.segments, targetSegments);
    if (params) {
      return {
        route: currentRoute,
        params,
        pathname: normalizedPathname,
      };
    }
  }

  return undefined;
}

function flattenRouteNode(
  app: ViactApp,
  node: RouteTreeNode,
  inherited: InheritedRouteConfig,
  routes: ResolvedRoute[],
): void {
  if (node.kind === "group") {
    const nextInherited: InheritedRouteConfig = {
      pathPrefix: mergeRoutePaths(inherited.pathPrefix, node.meta.pathPrefix),
      shell: node.meta.shell ?? inherited.shell,
      render: node.meta.render ?? inherited.render,
      middleware: [...inherited.middleware, ...(node.meta.middleware ?? [])],
    };

    for (const child of node.routes) {
      flattenRouteNode(app, child, nextInherited, routes);
    }

    return;
  }

  const fullPath = mergeRoutePaths(inherited.pathPrefix, node.path);
  const shell = node.shell ?? inherited.shell;
  const middleware = [...inherited.middleware, ...(node.middleware ?? [])];

  routes.push({
    id: node.id ?? createRouteId(fullPath),
    path: fullPath,
    file: node.file,
    shell,
    shellFile: shell ? app.shells[shell] : undefined,
    render: node.render ?? inherited.render,
    middleware,
    middlewareFiles: middleware.flatMap((name) => {
      const middlewareFile = app.middleware[name];
      return middlewareFile ? [middlewareFile] : [];
    }),
    revalidate: node.revalidate,
    segments: parseRouteSegments(fullPath),
  });
}

function isResolvedApp(app: ViactApp | ResolvedViactApp): app is ResolvedViactApp {
  return app.routes.length === 0 || "segments" in app.routes[0];
}

function matchRouteSegments(
  routeSegments: RouteSegment[],
  targetSegments: string[],
): RouteParams | null {
  const params: RouteParams = {};
  let routeIndex = 0;
  let targetIndex = 0;

  while (routeIndex < routeSegments.length) {
    const currentSegment = routeSegments[routeIndex];

    if (currentSegment.type === "catchall") {
      params[currentSegment.name] = targetSegments.slice(targetIndex).join("/");
      return params;
    }

    const targetSegment = targetSegments[targetIndex];
    if (typeof targetSegment === "undefined") {
      return null;
    }

    if (currentSegment.type === "static") {
      if (currentSegment.value !== targetSegment) {
        return null;
      }
    } else {
      params[currentSegment.name] = decodeURIComponent(targetSegment);
    }

    routeIndex += 1;
    targetIndex += 1;
  }

  return targetIndex === targetSegments.length ? params : null;
}

function parseRouteSegments(path: string): RouteSegment[] {
  return splitPathSegments(path).map((segment) => {
    if (segment === "*") {
      return {
        type: "catchall",
        name: "*",
      } as const;
    }

    if (segment.startsWith(":")) {
      return {
        type: "param",
        name: segment.slice(1),
      } as const;
    }

    return {
      type: "static",
      value: segment,
    } as const;
  });
}

function splitPathSegments(path: string): string[] {
  return normalizeRoutePath(path)
    .split("/")
    .filter(Boolean);
}

function mergeRoutePaths(prefix: string, path?: string): string {
  if (!path) {
    return normalizeRoutePath(prefix);
  }

  const normalizedPrefix = normalizeRoutePath(prefix);
  const normalizedPath = normalizeRoutePath(path);

  if (normalizedPrefix === "/") {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return normalizedPrefix;
  }

  return normalizeRoutePath(`${normalizedPrefix}/${normalizedPath.slice(1)}`);
}

function normalizeRoutePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");

  return collapsed.length > 1 && collapsed.endsWith("/")
    ? collapsed.slice(0, -1)
    : collapsed;
}

function createRouteId(path: string): string {
  if (path === "/") {
    return "index";
  }

  return path
    .slice(1)
    .split("/")
    .map((segment) => {
      if (segment === "*") {
        return "splat";
      }

      return segment.startsWith(":") ? segment.slice(1) : segment;
    })
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "-");
}
