import { Resend } from "resend";

import type { Env } from "@/env";

export function buildResendClient(env: Env): Resend {
  return new Resend(env.RESEND_API_KEY);
}
