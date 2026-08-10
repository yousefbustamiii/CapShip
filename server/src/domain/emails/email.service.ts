import { buildResendClient } from "@/infrastructure/resend/client";
import type { Env } from "@/env";

import licenseDeliveryTemplate from "./templates/license-delivery.html";

function buildLicenseEmail(licenseKey: string): string {
  return licenseDeliveryTemplate.replaceAll("{{LICENSE_KEY}}", licenseKey);
}

export async function sendLicenseDeliveryEmail(
  env: Env,
  to: string,
  licenseKey: string,
): Promise<void> {
  const resend = buildResendClient(env);

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject: "Your CapShip Pro License Key",
    html: buildLicenseEmail(licenseKey),
  });
}
