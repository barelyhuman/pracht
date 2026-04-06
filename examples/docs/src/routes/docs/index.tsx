export async function loader() {
  return new Response(null, {
    status: 302,
    headers: { location: "/docs/routing" },
  });
}

export function Component() {
  return null;
}
