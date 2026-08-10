import { Hono } from "hono";

import type { Env } from "@/env";

import { getFreeBundleUrl } from "./downloads.service";

type HonoEnv = { Bindings: Env };

export const downloadsRouter = new Hono<HonoEnv>();

downloadsRouter.get("/free", async (c) => {
  const result = await getFreeBundleUrl(c.env);
  return c.json({ success: true, data: result }, 200);
});
