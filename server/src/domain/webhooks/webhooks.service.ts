import {
  buildPolarClient,
  fetchPolarLicenseKey,
  isBenefitGrantCreated,
} from "@/infrastructure/polar/client";
import { getDb } from "@/infrastructure/db/client";
import type { Env } from "@/env";
import type { validateEvent } from "@polar-sh/sdk/webhooks";

import { createLicense } from "@/domain/licenses/licenses.service";
import { sendLicenseDeliveryEmail } from "@/domain/emails/email.service";

import { claimWebhookEvent } from "./webhooks.repository";

type PolarEvent = ReturnType<typeof validateEvent>;

export async function processVerifiedWebhookEvent(
  env: Env,
  event: PolarEvent,
): Promise<void> {
  if (!isBenefitGrantCreated(event)) return;

  const grant = event.data;
  const properties = grant.properties as { licenseKeyId?: string };

  if (!properties.licenseKeyId) return;

  const db = getDb(env);
  const claimed = await claimWebhookEvent(db, grant.id);
  if (!claimed) return;

  const client = buildPolarClient(env);
  const keyDetail = await fetchPolarLicenseKey(client, properties.licenseKeyId);

  await createLicense(env, {
    key: keyDetail.key,
    polar_id: keyDetail.id,
    polar_order: grant.orderId,
    customer_email: grant.customer.email,
  });

  await sendLicenseDeliveryEmail(env, grant.customer.email, keyDetail.key);
}
