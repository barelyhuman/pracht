import type { MiddlewareFn } from "viact";

export const middleware: MiddlewareFn = async ({ request }) => {
  const hasSession = request.headers.get("cookie")?.includes("session=") ?? false;

  if (!hasSession) {
    return { redirect: "/" };
  }
};
