import type { LoaderArgs, RouteComponentProps } from "viact";

export async function loader({ params }: LoaderArgs) {
  return {
    slug: params.slug,
    title: `Blog: ${params.slug.replace(/-/g, " ")}`,
  };
}

export function Component({ data }: RouteComponentProps<typeof loader>) {
  return (
    <section>
      <h1>{data.title}</h1>
      <p>You are reading the post with slug: <code>{data.slug}</code></p>
    </section>
  );
}
