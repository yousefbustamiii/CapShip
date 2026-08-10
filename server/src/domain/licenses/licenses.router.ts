import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type { Env } from "@/env";
import { adminAuthMiddleware } from "@/shared/middleware/auth";

import { redeemBodySchema, revokeLicenseParamsSchema } from "./licenses.validation";
import { redeemProLicense, revokeLicenseByKey } from "./licenses.service";

type HonoEnv = { Bindings: Env };

export const licensesRouter = new Hono<HonoEnv>();

licensesRouter.post(
  "/redeem",
  zValidator("json", redeemBodySchema),
  async (c) => {
    const { key } = c.req.valid("json");
    const ip = c.req.header("CF-Connecting-IP") ?? null;
    const result = await redeemProLicense(c.env, key, ip);
    return c.json({ success: true, data: result }, 200);
  },
);

licensesRouter.patch(
  "/revoke/:key",
  adminAuthMiddleware,
  zValidator("param", revokeLicenseParamsSchema),
  async (c) => {
    const { key } = c.req.valid("param");
    await revokeLicenseByKey(c.env, key);
    return c.json({ success: true, message: "License revoked." }, 200);
  },
);
