import { Form, type LoaderArgs, type RouteComponentProps } from "viact";

export async function loader({ request }: LoaderArgs) {
  const hasSession = request.headers.get("cookie")?.includes("session=") ?? false;

  return {
    projectCount: hasSession ? 3 : 0,
    user: hasSession ? "Ada Lovelace" : "Guest",
  };
}

export async function action() {
  return {
    data: { saved: true },
    ok: true,
    revalidate: ["route:self"],
  };
}

export function Component({ data }: RouteComponentProps<typeof loader>) {
  return (
    <section>
      <h1>{data.user}</h1>
      <p>Projects: {data.projectCount}</p>
      <Form method="post">
        <button type="submit">Revalidate dashboard</button>
      </Form>
    </section>
  );
}
