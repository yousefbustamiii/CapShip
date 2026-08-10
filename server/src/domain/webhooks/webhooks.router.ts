import { Hono } from "hono";

import type { Env } from "@/env";
import { verifyPolarWebhook } from "@/infrastructure/polar/client";

import { processVerifiedWebhookEvent } from "./webhooks.service";

type HonoEnv = { Bindings: Env };

export const webhooksRouter = new Hono<HonoEnv>();

webhooksRouter.post("/polar", async (c) => {
  const rawBody = await c.req.text();
  const headers = Object.fromEntries(c.req.raw.headers.entries());

  const event = await verifyPolarWebhook(rawBody, headers, c.env.POLAR_WEBHOOK_SECRET);

  await processVerifiedWebhookEvent(c.env, event);

  return c.json({ received: true }, 200);
});
