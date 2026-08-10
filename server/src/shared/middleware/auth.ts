import type { Context, Next } from "hono";

import type { Env } from "@/env";
import { Errors } from "@/shared/errors/http-error";
import { timingSafeEqual } from "@/shared/utils/crypto";

type AdminContext = Context<{ Bindings: Env }>;

export async function adminAuthMiddleware(
  c: AdminContext,
  next: Next,
): Promise<void> {
  const authHeader = c.req.header("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    throw Errors.unauthorized("Missing Authorization header");
  }

  const isValid = await timingSafeEqual(token, c.env.ADMIN_TOKEN);
  if (!isValid) {
    throw Errors.unauthorized("Invalid admin token");
  }

  await next();
}
