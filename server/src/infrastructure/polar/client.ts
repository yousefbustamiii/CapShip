import { Polar } from "@polar-sh/sdk";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

import type { Env } from "@/env";
import { Errors } from "@/shared/errors/http-error";

import type { PolarLicenseKeyDetail, PolarWebhookEvent } from "./polar.types";

export function buildPolarClient(env: Env): Polar {
  return new Polar({ accessToken: env.POLAR_ACCESS_TOKEN });
}

export async function verifyPolarWebhook(
  rawBody: string,
  headers: Record<string, string>,
  secret: string,
): Promise<PolarWebhookEvent> {
  try {
    validateEvent(rawBody, headers, secret);
    return JSON.parse(rawBody) as PolarWebhookEvent;
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      throw Errors.forbidden("Invalid Polar webhook signature");
    }
    throw err;
  }
}

export async function fetchPolarLicenseKey(
  client: Polar,
  licenseKeyId: string,
): Promise<PolarLicenseKeyDetail> {
  const result = await client.licenseKeys.get({ id: licenseKeyId });
  return {
    id: result.id,
    key: result.key,
    status: result.status,
  };
}

export function isBenefitGrantCreated(
  event: PolarWebhookEvent,
): event is Extract<PolarWebhookEvent, { type: "benefit_grant.created" }> {
  return event.type === "benefit_grant.created";
}
