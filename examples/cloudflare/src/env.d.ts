declare module "viact" {
  interface Register {
    context: {
      env: Env;
      executionContext: ExecutionContext;
    };
  }
}
