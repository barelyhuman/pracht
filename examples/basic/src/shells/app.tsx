import type { ShellProps } from "viact";

export function Shell({ children }: ShellProps) {
  return (
    <div class="app-shell">
      <aside>App navigation</aside>
      <main>{children}</main>
    </div>
  );
}

export function head() {
  return {
    title: "Viact App",
  };
}
