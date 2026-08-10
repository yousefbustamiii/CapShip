import type { Context, Next } from "hono";

const ALLOWED_ORIGINS = [
  "https://capship.org",
  "https://www.capship.org",
  "http://localhost:3000",
  "http://localhost:5173",
];

export async function corsMiddleware(c: Context, next: Next): Promise<void> {
  const origin = c.req.header("Origin") ?? "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  if (c.req.method === "OPTIONS") {
    c.header("Access-Control-Allow-Origin", isAllowed ? origin : "");
    c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    c.header("Access-Control-Max-Age", "86400");
    c.res = new Response(null, { status: 204 });
    return;
  }

  await next();

  if (isAllowed) {
    c.header("Access-Control-Allow-Origin", origin);
  }
}
