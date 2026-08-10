import { Hono } from "hono";

import type { Env } from "@/env";
import { HttpError } from "@/shared/errors/http-error";
import { corsMiddleware } from "@/shared/middleware/cors";
import { licensesRouter } from "@/domain/licenses/licenses.router";
import { downloadsRouter } from "@/domain/downloads/downloads.router";
import { webhooksRouter } from "@/domain/webhooks/webhooks.router";

const app = new Hono<{ Bindings: Env }>();

app.use("*", corsMiddleware);

app.route("/v1/downloads", downloadsRouter);
app.route("/v1/licenses", licensesRouter);
app.route("/v1/webhooks", webhooksRouter);

app.get("/health", (c) =>
  c.json({ status: "ok", service: "capship-api", version: "1.0.0" }, 200),
);

app.notFound((c) =>
  c.json(
    { success: false, error: { code: "NOT_FOUND", message: "Route not found" } },
    404,
  ),
);

app.onError((err, c) => {
  if (err instanceof HttpError) {
    return c.json(
      { success: false, error: { code: err.code ?? "ERROR", message: err.message } },
      err.statusCode as 400 | 401 | 403 | 404 | 409 | 500,
    );
  }

  console.error("[unhandled]", err);
  return c.json(
    { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
    500,
  );
});

export default app;
