import {
  buildPolarClient,
  fetchPolarLicenseKey,
  isBenefitGrantCreated,
} from "@/infrastructure/polar/client";
import type { Env } from "@/env";
import type { PolarWebhookEvent } from "@/infrastructure/polar/polar.types";

import { createLicense } from "@/domain/licenses/licenses.service";
import { sendLicenseDeliveryEmail } from "@/domain/emails/email.service";
import { Errors } from "@/shared/errors/http-error";

type LicenseKeyGrantProperties = { licenseKeyId?: string; license_key_id?: string };

function getLicenseKeyId(properties: unknown): string {
  const grantProperties = properties as LicenseKeyGrantProperties;
  const licenseKeyId = grantProperties.licenseKeyId ?? grantProperties.license_key_id;

  if (!licenseKeyId) {
    throw Errors.badRequest("Missing Polar license key id", "MISSING_LICENSE_KEY_ID");
  }

  return licenseKeyId;
}

export async function processVerifiedWebhookEvent(
  env: Env,
  event: PolarWebhookEvent,
): Promise<void> {
  if (!isBenefitGrantCreated(event)) return;

  const grant = event.data;
  if (grant.benefit.type !== "license_keys") return;

  const keyId = getLicenseKeyId(grant.properties);

  const client = buildPolarClient(env);
  const keyDetail = await fetchPolarLicenseKey(client, keyId);

  await createLicense(env, {
    key: keyDetail.key,
    polar_id: keyDetail.id,
    polar_order: grant.order_id,
    customer_email: grant.customer.email,
  });

  await sendLicenseDeliveryEmail(env, grant.customer.email, keyDetail.key);
}
