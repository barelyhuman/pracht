import { createContext, h } from "preact";
import type { ComponentChildren, JSX } from "preact";
import { useContext } from "preact/hooks";

import { matchAppRoute } from "./app.ts";
import type { ModuleRegistry, ViactApp } from "./types.ts";

export interface ViactHydrationState<TData = unknown> {
  url: string;
  routeId: string;
  data: TData;
}

export interface StartAppOptions<TData = unknown> {
  initialData?: TData;
}

export interface HandleViactRequestOptions<TContext = unknown> {
  app: ViactApp;
  request: Request;
  context?: TContext;
  registry?: ModuleRegistry;
  staticDir?: string;
  viteManifest?: unknown;
}

export interface SubmitActionOptions {
  action?: string;
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
}

export interface FormProps
  extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "action" | "method"> {
  action?: string;
  method?: string;
}

declare global {
  interface Window {
    __VIACT_STATE__?: ViactHydrationState;
  }
}

const RouteDataContext = createContext<unknown>(undefined);

export function ViactRuntimeProvider<TData>({
  children,
  data,
}: {
  children: ComponentChildren;
  data: TData;
}) {
  return h(RouteDataContext.Provider, {
    value: data,
    children,
  });
}

export function startApp<TData = unknown>(
  options: StartAppOptions<TData> = {},
): TData | undefined {
  if (typeof window === "undefined") {
    return options.initialData;
  }

  if (typeof options.initialData !== "undefined") {
    return options.initialData;
  }

  return window.__VIACT_STATE__?.data as TData | undefined;
}

export function useRouteData<TData = unknown>(): TData {
  return useContext(RouteDataContext) as TData;
}

export function useRevalidateRoute() {
  return async () => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const response = await fetch(window.location.pathname, {
      headers: {
        "x-viact-route-state-request": "1",
      },
    });

    return readResponseBody(response);
  };
}

export function useSubmitAction() {
  return async (options: SubmitActionOptions = {}) => {
    if (typeof window === "undefined") {
      throw new Error("useSubmitAction can only be used in the browser.");
    }

    const response = await fetch(options.action ?? window.location.pathname, {
      method: options.method ?? "POST",
      body: options.body ?? null,
      headers: options.headers,
    });

    return readResponseBody(response);
  };
}

export function Form(props: FormProps) {
  return h("form", props as JSX.HTMLAttributes<HTMLFormElement>);
}

export async function handleViactRequest<TContext>(
  options: HandleViactRequestOptions<TContext>,
): Promise<Response> {
  const url = new URL(options.request.url);
  const match = matchAppRoute(options.app, url.pathname);

  if (!match) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  const payload = {
    file: match.route.file,
    message:
      "Viact request handling is scaffolded. Rendering and loader execution are the next layer to implement.",
    params: match.params,
    path: match.route.path,
    render: match.route.render ?? null,
    routeId: match.route.id,
  };

  return Response.json(payload, {
    status: 501,
    headers: {
      "x-viact-scaffold": "true",
    },
  });
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
