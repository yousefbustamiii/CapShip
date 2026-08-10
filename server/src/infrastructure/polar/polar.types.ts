import type { BenefitGrantLicenseKeysProperties } from "@polar-sh/sdk/models/components/benefitgrantlicensekeysproperties";
import type { WebhookBenefitGrantCreatedPayload } from "@polar-sh/sdk/models/components/webhookbenefitgrantcreatedpayload";

export type { BenefitGrantLicenseKeysProperties, WebhookBenefitGrantCreatedPayload };

export interface PolarLicenseKeyDetail {
  id: string;
  key: string;
  status: string;
}
